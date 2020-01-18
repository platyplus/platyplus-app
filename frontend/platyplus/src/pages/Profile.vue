<template lang="pug">
q-page(v-if="authenticated" padding class="justify-center")
  div Profile page.
</template>

<style></style>
<script lang="ts">
import { createComponent } from '@vue/composition-api'

import { setTitle } from '../modules/common'
import { useAuthenticated } from '../modules/authentication'

export default createComponent({
  setup() {
    setTitle('user.profile.title')
    const authenticated = useAuthenticated()
    return { authenticated }
  }
})
</script>
