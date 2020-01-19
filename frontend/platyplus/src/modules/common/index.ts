import { Store } from 'vuex'
import Vue from 'vue'

export * from './composables'
export * from './types'
export * from './store'
export * from './router'
export * from './config'
export * from './apollo'
import { provideRouter } from './router'
import { provideStore } from './store'
import { getConfig } from './config'
import {
  IntrospectionResultData,
  createClient
} from '@platyplus/hasura-apollo-client'
import { provideApollo } from './apollo'

export const provideCommon = () => {
  const store = provideStore()
  const router = provideRouter()
  const apolloClient = provideApollo()
  return { store, router, apolloClient }
}

export interface CommonOptions {
  store: Store<{}>
  introspectionQueryResultData?: IntrospectionResultData
}
export function CommonPlugin(
  _Vue: typeof Vue,
  { store, introspectionQueryResultData }: CommonOptions
) {
  createClient({
    uri: getConfig().API,
    getToken: () => store.getters['authentication/encodedToken'],
    introspectionQueryResultData
  })
}
