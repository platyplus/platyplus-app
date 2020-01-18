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
import { useTranslator, useLocale, locales } from '../modules/i18n'
import { useTitle } from '../modules/common'

export default createComponent({
  setup() {
    const translate = useTranslator()
    const locale = useLocale()
    const title = useTitle()
    return { translate, locale, locales, title }
  }
})
</script>

<style></style>
