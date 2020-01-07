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
import ListItem from '../../elements/containers/ListItem.vue'
import Chip from '../../elements/containers/Chip.vue'

import { createComponent } from '@vue/composition-api'
import { listProps } from '../../../composables/metadata'

export default createComponent({
  name: 'Chips',
  components: {
    'h-list-item': ListItem,
    'h-chip': Chip
  },
  props: {
    ...listProps
  }
})
</script>
