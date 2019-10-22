<template lang="pug">
q-list(v-if="list.length" highlight)
  slot(name="before-item")
  slot(v-for="item in list" name="item")
    h-chip(:tableClass="tableClass" :element="item")
  slot(name="after-item")
div(v-else)
  slot(name="empty")
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { CollectionContainerMixin } from '../../../mixins'
import ListItem from '../../elements/containers/ListItem.vue'
import Chip from '../../elements/containers/Chip.vue'

@Component({
  components: {
    'h-list-item': ListItem,
    'h-chip': Chip
  }
})
export default class Chips extends Mixins(CollectionContainerMixin) {}
</script>
