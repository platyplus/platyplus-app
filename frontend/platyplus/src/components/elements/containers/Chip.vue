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
} from '../../../modules/metadata'

export default createComponent({
  props: { ...elementProps },
  setup(props) {
    const { action: read } = useReadElement(props.element) // TODO arg: reactive props
    const label = useElementLabel(props.element) // TODO arg: reactive props
    return { read, label }
  }
})
</script>
