<template lang="pug">
q-page(class="flex flex-center")
  q-btn(to="/public/auth/signin" icon="fas fa-sign-in-alt" :label="translate('login.button')")
</template>

<style></style>

<script lang="ts">
import { createComponent } from '@vue/composition-api'

import { setTitle } from '../composables/navigation'
import { useTranslator } from '../modules/i18n'

export default createComponent({
  setup() {
    setTitle('title')
    const translate = useTranslator()
    return { translate }
  }
})
</script>
