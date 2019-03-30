import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import fetch from 'node-fetch'
import { withClientState } from 'apollo-link-state'
// import { createHttpLink } from 'apollo-link-http'
import { createUploadLink } from 'apollo-upload-client'
import cloneDeep from 'lodash/cloneDeep'

import { WebSocketLink } from 'apollo-link-ws'
import { setContext } from 'apollo-link-context'
import { getMainDefinition } from 'apollo-utilities'
import { split } from 'apollo-link'
import { getUserToken } from 'plugins/auth'
import { resolvers as platyplusResolvers } from 'plugins/platyplus'
import { getConfig } from '../helpers/config'

const cache = new InMemoryCache()

const config = getConfig()
const resolvers = {
  // TODO: move the definitions to the platyplus plugin and import here
  ...platyplusResolvers,
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

const uri = `${window.location.protocol}//${config.API}`
const httpLink = createUploadLink({ uri, fetch })

const authHeaders = () => {
  const token = getUserToken()
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
  stateLink.concat(wsLink),
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

export const queryToSubscription = query => {
  // console.log(query)
  let subscription = cloneDeep(query)
  try {
    const index = subscription.definitions.findIndex(el => {
      return el.kind === 'OperationDefinition'
    })
    subscription.definitions[index].operation = 'subscription'
    // console.log(print(subscription))
    return subscription
  } catch (e) {
    console.log(e)
    throw Error('Impossible to convert query to subscription')
  }
}
export default ({ app, Vue }) => {
  Vue.use(VueApollo)
  app.apolloProvider = apolloProvider
}
