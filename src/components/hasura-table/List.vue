<template lang="pug">
q-list(v-if="list.length" highlight)
    slot(name="before-item")
    template(v-for="item in list")
      slot(name="item" :item="item")
        h-list-item(:element="item" :tableClass="tableClass")
    slot(name="after-item")
div(v-else)
  slot(name="empty")
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { HasuraMixin } from 'src/boot/hasura'
import ListItem from './ListItem.vue'

@Component({
  components: {
    'h-list-item': ListItem
  }
})
export default class HasuraTableList extends Mixins(HasuraMixin) {
  @Prop({ type: Array, default: () => [] }) list?: []
}
</script>
