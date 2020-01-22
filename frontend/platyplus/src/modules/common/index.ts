import { Store } from 'vuex'
import Vue from 'vue'

import { ApolloClient } from '@platyplus/hasura-apollo-client'

export * from './composables'
export * from './types'
export * from './store'
export * from './router'
export * from './config'
export * from './apollo'
export * from './helpers'

import { provideRouter } from './router'
import { provideStore, CommonStorePlugin } from './store'
import { provideApollo } from './apollo'
import { SetupContext, watch } from '@vue/composition-api'

export const provideCommon = (_props: never, context: SetupContext) => {
  const store = provideStore()
  const router = provideRouter()
  const apolloClient = provideApollo()
  watch(
    () => context.root.$route,
    (_currentRoute, previousRoute) =>
      store.commit('navigation/setFrom', previousRoute) // TODO usePrevious composable
  )
  return { store, router, apolloClient }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DefaultApolloClient = ApolloClient<any>

let _apolloClient: DefaultApolloClient
export const getApolloClient = () => _apolloClient
let _store: Store<{}>
export const getStore = () => _store
export interface CommonOptions {
  store: Store<{}>
  apolloClient: DefaultApolloClient
}
export function CommonPlugin(
  _Vue: typeof Vue,
  { apolloClient, store }: CommonOptions
) {
  _apolloClient = apolloClient
  _store = store
  CommonStorePlugin(store)
}
