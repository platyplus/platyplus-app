/**
 * * Configuration of the GraphQL client
 */
import {
  InMemoryCache,
  NormalizedCacheObject,
  IdGetter
} from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { split } from 'apollo-link'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

export let apolloClient: ApolloClient<NormalizedCacheObject>
interface CreateApolloClientOptions {
  uri: string
  getToken: () => string
  dataIdFromObject: IdGetter
}

export const createClient = ({
  uri,
  getToken,
  dataIdFromObject
}: CreateApolloClientOptions) => {
  const cache = new InMemoryCache({ dataIdFromObject })
  const httpLink = createHttpLink({ uri })

  const authHeaders = () => {
    const token = getToken()
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
  apolloClient = new ApolloClient({
    link,
    cache,
    // shouldBatch: true, // https://blog.apollographql.com/query-batching-in-apollo-63acfd859862 // TODO when available in Hasura
    connectToDevTools: true // * automatic in development, option for production
  })
  return apolloClient
}
