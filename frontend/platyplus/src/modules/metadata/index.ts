import { Store } from 'vuex'
import Vue from 'vue'
import { metadataModule } from './store'
import { CommonPlugin } from '../common'
import { ApolloClient } from '@platyplus/hasura-apollo-client'

export { tableNamesList, tableMetadata, tablesMetadata } from './getters'
export * from './composables'
export { default as introspectionQueryResultData } from './fragmentTypes.json'
export * from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DefaultApolloClient = ApolloClient<any>
let _apolloClient: DefaultApolloClient
export const getApolloClient = () => _apolloClient

type Options = {
  store: Store<{}>
  apolloClient: DefaultApolloClient
}

export function MetadataPlugin(
  _Vue: typeof Vue,
  { store, apolloClient }: Options
) {
  _apolloClient = apolloClient
  Vue.use(CommonPlugin, { store, apolloClient })
  store.registerModule('metadata', metadataModule)
}
