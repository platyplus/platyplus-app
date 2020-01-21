<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { createComponent, onBeforeMount } from '@vue/composition-api'
import { provideCommon } from './modules/common'
import { provideQuasar } from './modules/quasar'
import { provideI18n } from './modules/i18n'
import messages from './i18n'
import { persistApolloCache } from '@platyplus/vuex-apollo-offline'

export default createComponent({
  setup(props, context) {
    const { store, apolloClient } = provideCommon(props, context)
    // ? only load the messages of the desired language?
    provideI18n({ store, messages })
    provideQuasar(store, context.root.$q) // TODO not ideal: try to put this in the Vue plugin
    onBeforeMount(async () => await persistApolloCache(apolloClient.cache))
  }
})
</script>

<style></style>
