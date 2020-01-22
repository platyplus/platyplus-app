<template lang="pug">
q-chip(:clickable="true" @click="read()")
    div {{label}}
</template>

<script lang="ts">
import { createComponent, computed } from '@vue/composition-api'
import {
  elementProps,
  useReadElement,
  useElementLabel
} from '../../../../metadata'

export default createComponent({
  props: { ...elementProps },
  setup(props) {
    const element = computed(() => props.element)
    const { action: read } = useReadElement(element)
    const label = useElementLabel(element) // TODO arg: reactive props
    return { read, label }
  }
})
</script>
