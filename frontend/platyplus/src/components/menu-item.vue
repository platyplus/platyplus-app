<template lang="pug">
  q-item(clickable :to="to" :exact="true")
    q-item-section(avatar)
      q-icon(:name="'fas fa-'+icon")
    q-item-section
      slot
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'

export default createComponent({
  props: {
    icon: String,
    to: String
  }
})
</script>

<style></style>
