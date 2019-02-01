import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import fetch from 'node-fetch'
import { withClientState } from 'apollo-link-state'
import { createHttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { setContext } from 'apollo-link-context'
import { getMainDefinition } from 'apollo-utilities'
import { split } from 'apollo-link'
import { getUserToken } from 'plugins/auth'
import config from 'clientconfig'

const cache = new InMemoryCache()
const HTTP_PROTOCOL = config.HTTP_PROTOCOL || process.env.HTTP_PROTOCOL
const API = config.API || process.env.API

const resolvers = {
  Mutation: {
    // updateProfile (_, { id, token }, { cache }) {
    //   const data = {
    //     hello: {
    //       __typename: 'Profile',
    //       id,
    //       token
    //     }
    //   }
    //   return cache.writeData({ data })
    // }
  }
}

const stateLink = withClientState({
  cache,
  resolvers,
  defaults: {
    // profile: {
    //   __typename: 'Profile',
    //   id: 'an id',
    //   token: '1234'
    // }
  }
})

const httpLink = createHttpLink({
  uri: `${HTTP_PROTOCOL}://${API}`,
  fetch: fetch
})

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: `ws://${API}`,
  options: {
    reconnect: true,
    connectionParams: {
      headers: {
        'X-Hasura-Access-Key': 'mysecretaccesskey' // TODO: token
      }
    }
  }
})

const authLink = setContext((_, { headers }) => {
  const token = getUserToken()
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
      // 'X-Hasura-Access-Key': 'mysecretaccesskey'
    }
  }
})

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  authLink.concat(stateLink.concat(httpLink))
)

// Create the apollo client
export const apolloClient = new ApolloClient({
  link,
  cache,
  shouldBatch: true, // https://blog.apollographql.com/query-batching-in-apollo-63acfd859862
  connectToDevTools: true
})

export const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
  errorHandler ({ graphQLErrors, networkError }) {
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

export default ({ app, Vue }) => {
  Vue.use(VueApollo)
  app.apolloProvider = apolloProvider
}
