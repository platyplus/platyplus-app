const {
  ApolloServer,
  makeRemoteExecutableSchema,
  introspectSchema,
  mergeSchemas
} = require('apollo-server-fastify')
// const { split } = require('apollo-link')
const fetch = require('node-fetch')
const { getMainDefinition } = require('apollo-utilities')
const { RetryLink } = require('apollo-link-retry')
const { HttpLink } = require('apollo-link-http')
const { setContext } = require('apollo-link-context')
const { WebSocketLink } = require('apollo-link-ws')
const { SubscriptionClient } = require('subscriptions-transport-ws')
const WebSocket = require('ws')
const sleep = require('util').promisify(setTimeout)

const fastify = require('fastify')({
  logger: !(process.env.NODE_ENV === 'production')
})
// TODO: workaround to proxy file upload, until mergeShemas allows multipart upload
const { resolvers } = require('./functions')

const setAuthContext = setContext((request, previousContext) => {
  if (
    previousContext.graphqlContext &&
    previousContext.graphqlContext.headers &&
    previousContext.graphqlContext.headers.authorization
  ) {
    return {
      headers: {
        authorization: previousContext.graphqlContext.headers.authorization
      }
    }
  } else {
    return {}
  }
})

const createRemoteExecutableSchema = async uri => {
  const httpLink = setAuthContext.concat(
    new HttpLink({
      uri,
      fetch
    })
  )
  // const wsLink = new WebSocketLink({
  //   uri: uri.replace('http', 'ws'),
  //   options: {
  //     reconnect: true
  //   },
  //   webSocketImpl: WebSocket
  // })

  const wsClient = new SubscriptionClient(
    uri.replace('http', 'ws'),
    {
      reconnect: true // if connection is lost, retry
    },
    WebSocket
  )
  const wsLink = new WebSocketLink(wsClient)

  // const link = split(
  //   // split based on operation type
  //   ({ query }) => {
  //     const { kind, operation } = getMainDefinition(query)
  //     return kind === 'OperationDefinition' && operation === 'subscription'
  //   },
  //   wsLink,
  //   httpLink
  // )

  const link = new RetryLink({
    // these are the defaults, change them as you will
    delay: {
      initial: 300, // The number of milliseconds to wait before attempting the first retry.
      max: Infinity, // The maximum number of milliseconds that the link should wait for any retry
      jitter: true // Whether delays between attempts should be randomized.
    },
    attempts: {
      max: 5, // The max number of times to try a single operation before giving up.
      retryIf: (error, _operation) => !!error // A predicate function that can determine whether a particular response should be retried.
    }
  }).split(
    // using "Directional Composition" of links
    ({ query }) => {
      console.log('---------')
      const { kind, operation } = getMainDefinition(query)
      console.log(kind)
      console.log(operation)
      return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    httpLink
  )

  const remoteSchema = await introspectSchema(link, {
    headers: {
      'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
    }
  })
  console.log('------remote ok')
  const remoteExecutableSchema = makeRemoteExecutableSchema({
    schema: remoteSchema,
    link
  })
  return remoteExecutableSchema
}

const createNewSchema = async () => {
  // get remote executable schema
  // TODO: Wait for each service
  // TODO: doesnt work :(
  let status = 0
  while (status !== 200) {
    if (status > 0) {
      await sleep(1000)
      console.log(
        'Waiting for the Hasura Graphql Engine service to be ready...'
      )
    }
    try {
      status = (await fetch('http://graphql-engine:3000/v1/version')).status
    } catch (e) {
      status = 0
    }
  }
  const hasura = await createRemoteExecutableSchema(process.env.HASURA_URL)
  const auth = await createRemoteExecutableSchema(process.env.AUTH_URL)
  const functions = await createRemoteExecutableSchema(
    process.env.FUNCTIONS_URL
  )

  // merge the schema along with custom resolvers
  return mergeSchemas({
    schemas: [hasura, auth, functions],
    resolvers
  })
}

fastify.register(require('fastify-healthcheck'), {
  healthcheckUrl: '/healthcheck'
})

const start = async () => {
  try {
    const schema = await createNewSchema()
    const server = new ApolloServer({
      schema,
      introspection: true,
      context: request => ({
        ...request
      }),
      uploads: {
        // https://github.com/jaydenseric/graphql-upload#type-uploadoptions
        maxFileSize: 10000000, // 10 MB
        maxFiles: 20
      }
    })
    fastify.register(server.createHandler({ path: '/' }))
    await fastify.listen(process.env.PORT || 3000, '0.0.0.0')
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
