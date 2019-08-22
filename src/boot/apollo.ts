/**
 * Configuration of the GraphQL client
 */
import { ApolloClient, ApolloError } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
// import fetch from 'node-fetch'
import { createUploadLink } from 'apollo-upload-client'
import clone from 'clone'

import { WebSocketLink } from 'apollo-link-ws'
import { setContext } from 'apollo-link-context'
import { getMainDefinition } from 'apollo-utilities'
import { split, DocumentNode } from 'apollo-link'
import { getEncodedToken, getClaim } from './user'
// import { resolvers as platyplusResolvers } from './platyplus'
import { getConfig } from '../helpers'
import { QuasarBootOptions } from 'src/types/quasar'
// import gql from 'graphql-tag'
// import { OperationDefinitionNode } from 'graphql'

// const typeDefs = gql`
//   type token {
//     id: ID
//     encoded: String
//   }
//   extend type Query {
//     token: token
//   }
//   extend type Mutation {
//     updateToken(token: String!): token
//   }
// `
const config = getConfig()

// const resolvers = {
//   // ...platyplusResolvers, // TODO TS
//   Mutation: {
//     updateToken
//   }
// }

const cache = new InMemoryCache()
function setDefaultState() {
  cache.writeData({
    data: {
      token: {
        __typename: 'token',
        id: null,
        encoded: null
      }
    }
  })
}
setDefaultState()

const uri = `${window.location.protocol}//${config.API}`
// const httpLink = createUploadLink({ uri, fetch }) // TODO TS
const httpLink = createUploadLink({ uri })

const authHeaders = () => {
  const token = getEncodedToken()
  if (token) {
    return {
      Authorization: `Bearer ${token}`
    }
  } else return {}
}
// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: uri.replace('http', 'ws'),
  options: {
    lazy: true,
    reconnect: true,
    connectionParams: () => ({
      headers: authHeaders(),
      ...authHeaders()
    })
  }
})

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    ...authHeaders()
  }
}))

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const result = getMainDefinition(query)
    return (
      result.kind === 'OperationDefinition' &&
      result.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink)
)

// Create the apollo client
export const apolloClient = new ApolloClient({
  link,
  cache,
  // resolvers,
  // shouldBatch: true, // https://blog.apollographql.com/query-batching-in-apollo-63acfd859862 // TODO TS?
  connectToDevTools: true
})

// apolloClient.onResetStore(() => new Promise(setDefaultState)) // TODO TS

export const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
  errorHandler({ graphQLErrors, networkError }: ApolloError) {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      )
    }
    if (networkError) {
      console.log(`[Network error]: ${networkError}`)
    }
  }
})

/**
 * Converts a GraphQL query defined in SDL into its equivalent subscription
 * @param {*} query
 */
export const queryToSubscription = (query: DocumentNode) => {
  // TODO TS https://github.com/apollographql/apollo-client/issues/3090
  const subscription = clone(query)
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const index = subscription.definitions.findIndex((el: any) => {
      // TODO TS
      return el.kind === 'OperationDefinition'
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const def = subscription.definitions[index] as any
    def.operation = 'subscription'
    return subscription
  } catch (e) {
    console.error(e)
    throw Error('Impossible to convert query to subscription')
  }
}

export default ({ app, Vue }: QuasarBootOptions) => {
  Vue.use(VueApollo)
  app.apolloProvider = apolloProvider
}

declare module 'vue/types/vue' {
  interface Vue {
    apolloProvider?: VueApollo
  }
}
