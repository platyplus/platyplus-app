<template lang="pug">
  q-page(padding class="justify-center")
    router-view
</template>

<style></style>

<script lang="ts">
import { createComponent } from '@vue/composition-api'

export default createComponent({
  name: 'Page'
})
</script>
