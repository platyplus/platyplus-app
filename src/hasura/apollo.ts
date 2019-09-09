/**
 * * Configuration of the GraphQL client
 */
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory'
import { persistCache as apolloPersistCache } from 'apollo-cache-persist'
import { ApolloClient, ApolloError } from 'apollo-client'
import { split, DocumentNode } from 'apollo-link'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import clone from 'clone'
import VueApollo from 'vue-apollo'

import { store } from 'src/store'
import { getConfig } from 'src/helpers'

import { dataIdFromObject } from './graphql/apollo'
import { PersistentStorage, PersistedData } from 'apollo-cache-persist/types'

const config = getConfig()

const cache = new InMemoryCache({ dataIdFromObject })

const uri = `${window.location.protocol}//${config.API}`

const httpLink = createHttpLink({ uri })

const authHeaders = () => {
  const token = store.getters['user/encodedToken']
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

export const persistCache = async () => {
  // await before instantiating ApolloClient, else queries might run before the cache is persisted
  await apolloPersistCache({
    cache,
    storage: localStorage as PersistentStorage<
      PersistedData<NormalizedCacheObject>
    >
  })
}

// Create the apollo client
export const apolloClient = new ApolloClient({
  link,
  cache,
  // shouldBatch: true, // https://blog.apollographql.com/query-batching-in-apollo-63acfd859862 // TODO when available in Hasura
  connectToDevTools: true // * automatic in development, option for production
})

export const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
  defaultOptions: {
    // $loadingKey: 'loadingQueries',
    $query: {
      loadingKey: 'loadingQueries' // * Cannot use a key starting with a dollar
    }
    // fetchPolicy: 'cache-and-network',
  },
  errorHandler({ graphQLErrors, networkError }: ApolloError) {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) =>
        console.warn(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      )
    }
    if (networkError) {
      console.warn(`[Network error]: ${networkError}`)
    }
  }
})

/**
 * Converts a GraphQL query defined in SDL into its equivalent subscription
 * @param {*} query
 */
// ? get rid of this? Not in use anymore
export const queryToSubscription = (query: DocumentNode) => {
  // TODO TS https://github.com/apollographql/apollo-client/issues/3090
  const subscription = clone(query)
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const index = subscription.definitions.findIndex((el: any) => {
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
