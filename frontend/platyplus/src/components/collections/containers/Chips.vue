<template lang="pug">
q-list(v-if="list.length" highlight)
  slot(name="before-item")
  slot(v-for="item in list" name="item")
    h-chip(:table="table" :element="item")
  slot(name="after-item")
div(v-else)
  slot(name="empty")
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
import { listProps } from '../../../composables/metadata'

export default createComponent({
  props: {
    ...listProps
  }
})
</script>
