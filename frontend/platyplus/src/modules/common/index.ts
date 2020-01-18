export * from './composables'
export * from './types'
export * from './store'
export * from './router'
export * from './config'
export * from './apollo'
import { provideRouter } from './router'
import { provideStore } from './store'
import { getConfig } from './config'
import { provideApollo } from './apollo'
import { IntrospectionResultData } from '@platyplus/hasura-apollo-client'
export interface CommonOptions {
  introspectionQueryResultData?: IntrospectionResultData
}
export const provideCommon = ({
  introspectionQueryResultData
}: CommonOptions) => {
  const store = provideStore()
  const router = provideRouter()
  const apolloClient = provideApollo({
    uri: getConfig().API,
    getToken: () => store.getters['authentication/encodedToken'],
    introspectionQueryResultData
  })
  return { store, router, apolloClient }
}
