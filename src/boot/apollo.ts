/**
 * * Configuration of the GraphQL client
 */
import { ApolloClient, ApolloError } from 'apollo-client'
import { InMemoryCache, IdGetterObj } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import clone from 'clone'
import { WebSocketLink } from 'apollo-link-ws'
import { setContext } from 'apollo-link-context'
import { getMainDefinition } from 'apollo-utilities'
import { split, DocumentNode } from 'apollo-link'
import { createHttpLink } from 'apollo-link-http'
import { getEncodedToken } from './user'
import { getConfig } from '../helpers'
import { QuasarBootOptions } from 'src/types/quasar'
import { Component, Watch, Vue, Mixins } from 'vue-property-decorator'
import { ObjectMap } from 'src/types/common'
import { uniqueGraphQlId } from './hasura/graphql/common'

const config = getConfig()

const cache = new InMemoryCache({
  /**
   * * Returns the 'Graphql ID' of the object so it can be normalized in the cache.
   * - Generate custom IDs for special object types e.g. table, permission...
   * - If tableClasses are loaded, and if there is more than one primary key column, generate a custom ID
   * - Use the default generated ID otherwise.
   */
  dataIdFromObject: (object: IdGetterObj) => {
    const obj = object as ObjectMap
    switch (object.__typename) {
      case 'table':
        return `table:${obj.table_schema}.${obj.table_name}`
      case 'permission':
        return `permission:${obj.table_schema}.${obj.table_name}.${obj.role_name}`
      case 'relationship':
        return `relationship:${obj.table_schema}.${obj.table_name}.${obj.name}`
      case 'primary_key':
        return `primary_key:${obj.table_schema}.${obj.table_name}.${obj.constraint_name}`
      case 'foreign_key_constraint':
        return `foreign_key_constraint:${obj.table_schema}.${obj.table_name}.${obj.constraint_name}`
      case 'check_constraint':
        return `check_constraint:${obj.table_schema}.${obj.table_name}.${obj.constraint_name}`
      default:
        return uniqueGraphQlId(obj)
    }
  }
})

const uri = `${window.location.protocol}//${config.API}`

const httpLink = createHttpLink({ uri })

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

/**
 * Global mixin that uses the 'loadingQueries' key with Apollo and
 * that shows/hides the Quasar loading plugin spinner
 */
@Component
export class ApolloMixin extends Vue {
  public loadingQueries: number = 0

  @Watch('loadingQueries')
  public onLoadingQueriesChanged(newValue: number) {
    if (newValue > 0) {
      this.$q.loading.show()
    } else {
      this.$q.loading.hide()
    }
  }

  public beforeDestroy() {
    this.$q.loading.hide()
  }
}

export default ({ app, Vue }: QuasarBootOptions) => {
  Vue.use(VueApollo)
  Vue.mixin(Mixins(ApolloMixin))
  app.apolloProvider = apolloProvider
}

declare module 'vue/types/vue' {
  interface Vue {
    apolloProvider?: VueApollo
  }
}
