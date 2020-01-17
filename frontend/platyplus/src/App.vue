<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { createComponent, provide } from '@vue/composition-api'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { apolloClient } from '@platyplus/hasura-apollo-client'

import { provideRouter, provideStore } from './modules/common'
import { provideQuasar } from './modules/quasar'
import { provideI18n } from './modules/i18n'

export default createComponent({
  setup(props, context) {
    // ? find a way to put this elsewhere?
    provideStore()
    provideQuasar(context.root.$q) // TODO not ideal: try to put this in the Vue plugin
    provideRouter()
    provideI18n()
    provide(DefaultApolloClient, apolloClient) // TODO use directly 'createClient' from platyplus/hasura-apollo-client
  }
})
</script>

<style></style>
