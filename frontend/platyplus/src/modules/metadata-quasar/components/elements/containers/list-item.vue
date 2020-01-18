<template lang="pug">
q-item(v-if="element" :clickable="true" @click="read()" exact)
    q-item-section {{label}}
div(v-else) Element does not exist
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
import {
  useReadElement,
  useElementLabel,
  elementProps
} from '../../../../metadata'

export default createComponent({
  props: { ...elementProps },
  setup({ element }) {
    const { action: read } = useReadElement(element)
    const label = useElementLabel(element)
    return { read, label }
  }
})
</script>
