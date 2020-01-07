<template lang="pug">
q-layout(view="lHh Lpr lFf")
  q-header
    router-view(name="header")
  router-view(name="menu")
  q-page-container
    router-view
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'

export default createComponent({
  name: 'UserLayout'
})
</script>

<style></style>
