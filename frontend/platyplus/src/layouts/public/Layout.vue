<template lang="pug">
q-layout(view="lHh Lpr lFf")
  q-header
    router-view(name="header")
  q-page-container
    router-view
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'

export default createComponent({
  name: 'PublicLayout'
})
</script>

<style></style>
