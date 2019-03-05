const {
  ApolloServer,
  makeRemoteExecutableSchema,
  introspectSchema,
  mergeSchemas
} = require('apollo-server-fastify')
const { HttpLink } = require('apollo-link-http')
const { setContext } = require('apollo-link-context')
const fetch = require('node-fetch')
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
  const link = setAuthContext.concat(
    new HttpLink({
      uri,
      fetch
    })
  )
  const remoteSchema = await introspectSchema(link, {
    headers: {
      'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET
    }
  })
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
