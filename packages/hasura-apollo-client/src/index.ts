/**
 * * Configuration of the GraphQL client
 */
import {
  InMemoryCache,
  NormalizedCacheObject,
  IdGetter,
  IntrospectionFragmentMatcher,
  IntrospectionResultData,
  IdGetterObj,
  defaultDataIdFromObject
} from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { split, ApolloLink } from 'apollo-link'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

export let apolloClient: ApolloClient<NormalizedCacheObject>
interface CreateApolloClientOptions {
  uri: string
  getToken: () => string
  dataIdFromObject: IdGetter
  errorsLink?: ApolloLink
  introspectionQueryResultData?: IntrospectionResultData
}

export const createClient = ({
  uri,
  getToken,
  dataIdFromObject,
  errorsLink,
  introspectionQueryResultData
}: CreateApolloClientOptions) => {
  if (apolloClient) return apolloClient
  // ! https://github.com/apollographql/apollo-client/issues/3397
  const fragmentMatcher = introspectionQueryResultData
    ? new IntrospectionFragmentMatcher({
        introspectionQueryResultData
      })
    : undefined
  const cache = new InMemoryCache({ dataIdFromObject, fragmentMatcher })
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
  let link = split(
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

  if (errorsLink) link = ApolloLink.from([errorsLink, link])

  // Create the apollo client
  apolloClient = new ApolloClient({
    link,
    cache
    // shouldBatch: true, // https://blog.apollographql.com/query-batching-in-apollo-63acfd859862 // TODO when available in Hasura
    // connectToDevTools: true // * automatic in development, option for production
  })
  return apolloClient
}

/** // TODO code the cache operations e.g.:
 * update org_unit.children when another org_unit.parent_id has been changed
 * update the lists (e.g. org_unit, org_unit where XYZ) when an item has been added/deleted
 * etc
 */

/**
 * * Returns the 'Graphql ID' of the object so it can be normalized in the cache.
 * - Generate custom IDs for special object types e.g. table, permission...
 * - If tableClasses are loaded, and if there is more than one primary key column, generate a custom ID
 * - Use the default generated ID otherwise.
 */
export const dataIdFromObject = (object: IdGetterObj) => {
  if (typeof object.__typename === 'string' && !object.id) {
    const subIds = Object.keys(object).filter(key => key.endsWith('_id'))
    if (subIds.length > 0)
      return `${object.__typename}:${subIds
        .map(key => (object as { [k: string]: string })[key])
        .join('.')}`
    // if ((object as ObjectMap).name)
    //   return `${object.__typename}:${(object as ObjectMap).name}`
  }
  return defaultDataIdFromObject(object)
}

export { IntrospectionResultData }
