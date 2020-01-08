<template lang="pug">
q-item(v-if="element" :to="readLink" exact)
    q-item-section {{label}}
div(v-else) Element does not exist
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
import {
  useElementContainer,
  elementProps
} from '../../../composables/metadata'

export default createComponent({
  props: {
    ...elementProps
  },
  setup(props) {
    const { label, readLink } = useElementContainer(props)
    return { label, readLink }
  }
})
</script>
