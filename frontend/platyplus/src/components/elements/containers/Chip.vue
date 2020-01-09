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
  props: {
    ...elementProps
  },
  setup({ element }) {
    const { label, readLink } = useElementContainer(element)
    return { label, readLink }
  }
})
</script>
