<template lang="pug">
q-chip(:clickable="true" @click="read()")
    div {{label}}
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
import {
  elementProps,
  useReadElement,
  useElementLabel
} from '../../../composables/metadata'

export default createComponent({
  props: {
    ...elementProps
  },
  setup({ element }) {
    const { action: read } = useReadElement(element)
    const label = useElementLabel(element)
    return { read, label }
  }
})
</script>
