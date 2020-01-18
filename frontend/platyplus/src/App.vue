<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
import {
  provideStore,
  provideRouter,
  provideApollo,
  getConfig
} from './modules/common'
import { provideQuasar } from './modules/quasar'
import { provideI18n } from './modules/i18n'
import {
  introspectionQueryResultData,
  provideMetadata
} from './modules/metadata'
import messages from './i18n'

export default createComponent({
  setup(props, context) {
    const store = provideStore()
    provideRouter()
    provideApollo({
      uri: getConfig().API,
      getToken: () => store.getters['authentication/encodedToken'],
      introspectionQueryResultData
    })
    provideMetadata(store)
    provideI18n({ store, messages })
    provideQuasar(store, context.root.$q) // TODO not ideal: try to put this in the Vue plugin
  }
})
</script>

<style></style>
