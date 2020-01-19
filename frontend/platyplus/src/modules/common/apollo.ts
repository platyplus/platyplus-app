import { provide, onBeforeMount } from '@vue/composition-api'
import { DefaultApolloClient } from '@vue/apollo-composable'

import { persistApolloCache } from '@platyplus/vuex-apollo-offline'
import { apolloClient } from '@platyplus/hasura-apollo-client'

export const provideApollo = async () => {
  provide(DefaultApolloClient, apolloClient)
  onBeforeMount(async () => await persistApolloCache(apolloClient.cache))
  return apolloClient
}
