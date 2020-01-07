<template lang="pug">
q-page(class="flex flex-center")
  q-btn(to="/public/auth/signin" icon="fas fa-sign-in-alt" :label="$t('login.button')")
</template>

<style></style>

<script lang="ts">
import { createComponent } from '@vue/composition-api'

import { setTitle } from '../composables/navigation'

export default createComponent({
  setup() {
    setTitle('title')
  }
})
</script>
