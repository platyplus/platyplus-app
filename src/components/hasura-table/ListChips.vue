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
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { HasuraMixin } from 'src/boot/hasura'
import ListItem from './ListItem.vue'
import Chip from './Chip.vue'

@Component({
  components: {
    'h-list-item': ListItem,
    'h-chip': Chip
  }
})
export default class HasuraTableList extends Mixins(HasuraMixin) {
  @Prop({ type: Array, default: () => [] }) list?: []
}
</script>
