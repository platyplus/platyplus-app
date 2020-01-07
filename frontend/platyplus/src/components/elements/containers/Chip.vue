<template lang="pug">
q-chip(:to="readLink")
    div {{label}}
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
import {
  elementProps,
  useElementContainer
} from '../../../composables/metadata'

export default createComponent({
  name: 'Chip',
  props: {
    ...elementProps
  },
  setup({ table, element }) {
    const { label, readLink } = useElementContainer(element, table)
    return { label, readLink }
  }
})
</script>
