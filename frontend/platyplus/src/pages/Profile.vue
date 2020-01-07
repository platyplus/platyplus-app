<template lang="pug">
q-page(v-if="$authenticated" padding class="justify-center")
  div Profile page.
</template>

<style></style>
<script lang="ts">
import { createComponent } from '@vue/composition-api'

import { setTitle } from '../composables/navigation'

export default createComponent({
  name: 'Profile',
  setup() {
    setTitle('user.profile.title')
  }
})
</script>
