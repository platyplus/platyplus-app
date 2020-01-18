import { provide, onBeforeMount } from '@vue/composition-api'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { persistApolloCache } from '@platyplus/vuex-apollo-offline'

import {
  createClient,
  CreateApolloClientOptions
} from '@platyplus/hasura-apollo-client'

export const provideApollo = async (options: CreateApolloClientOptions) => {
  const apolloClient = createClient(options)
  provide(DefaultApolloClient, apolloClient)
  onBeforeMount(async () => await persistApolloCache(apolloClient.cache)) // TODO test
  return apolloClient
}
