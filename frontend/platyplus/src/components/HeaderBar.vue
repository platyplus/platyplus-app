<template lang="pug">
q-toolbar(color="primary")
    slot(name="left")
    q-toolbar-title {{ title.translate ? translate(title.label) : title.label }}
    q-select(
      hide-underline
      emit-value
      map-options
      :options="locales"
      v-model="locale")
    slot(name="right")  
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'

import { useTranslator, useLocale } from '../composables/i18n'
import { useTitle } from '../composables/navigation'
import { locales } from '../modules/i18n'

export default createComponent({
  name: 'HeaderBar',

  setup() {
    const translate = useTranslator()
    const locale = useLocale()
    const title = useTitle()
    return { translate, locale, locales, title }
  }
})
</script>

<style></style>
