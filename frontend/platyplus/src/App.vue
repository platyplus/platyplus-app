<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
import { provideCommon } from './modules/common'
import { provideQuasar } from './modules/quasar'
import { provideI18n } from './modules/i18n'
import messages from './i18n'

export default createComponent({
  setup(props, context) {
    const { store } = provideCommon()
    // ? only load the messages of the desired language?
    provideI18n({ store, messages })
    provideQuasar(store, context.root.$q) // TODO not ideal: try to put this in the Vue plugin
  }
})
</script>

<style></style>
