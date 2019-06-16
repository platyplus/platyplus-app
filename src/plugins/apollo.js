/**
 * Configuration of the GraphQL client
 */
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import fetch from 'node-fetch'
import { createUploadLink } from 'apollo-upload-client'
import cloneDeep from 'lodash/cloneDeep'

import { WebSocketLink } from 'apollo-link-ws'
import { setContext } from 'apollo-link-context'
import { getMainDefinition } from 'apollo-utilities'
import { split } from 'apollo-link'
import { getToken, updateToken } from 'plugins/auth'
import { resolvers as platyplusResolvers } from 'plugins/platyplus'
import { getConfig } from '../helpers'
import gql from 'graphql-tag'

const typeDefs = gql`
  type token {
    id: ID
    encoded: String
  }
  extend type Query {
    token: token
  }
  extend type Mutation {
    updateToken(token: String!): token
  }
`
const config = getConfig()

const resolvers = {
  ...platyplusResolvers,
  Mutation: {
    updateToken
  }
}

const cache = new InMemoryCache()
function setDefaultState () {
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
const httpLink = createUploadLink({ uri, fetch })

const authHeaders = () => {
  const token = getToken().encoded
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
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  authLink.concat(httpLink)
)

// Create the apollo client
export const apolloClient = new ApolloClient({
  link,
  cache,
  typeDefs,
  resolvers,
  shouldBatch: true, // https://blog.apollographql.com/query-batching-in-apollo-63acfd859862
  connectToDevTools: true
})

apolloClient.onResetStore(setDefaultState)

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

/**
 * Converts a GraphQL query defined in SDL into its equivalent subscription
 * @param {*} query
 */
export const queryToSubscription = query => {
  let subscription = cloneDeep(query)
  try {
    const index = subscription.definitions.findIndex(el => {
      return el.kind === 'OperationDefinition'
    })
    subscription.definitions[index].operation = 'subscription'
    return subscription
  } catch (e) {
    console.error(e)
    throw Error('Impossible to convert query to subscription')
  }
}
export default ({ app, Vue }) => {
  Vue.use(VueApollo)
  app.apolloProvider = apolloProvider
}
