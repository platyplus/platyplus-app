<template lang="pug">
q-tree(v-if="list.length" highlight
  :selected.sync="selectedNode"
  :expanded.sync="expandedNodes"
  :nodes="list"
  node-key="id"
  label-key="name"
)
div(v-else)
  slot(name="empty")
</template>

<script lang="ts">
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { HasuraMixin } from 'src/boot/hasura'
import Handlebars from 'handlebars'

// TODO review the way the graphql query is built to get children's children (e.g. org unit)
// TODO: OR: scan the list through a computed field and add the missing children properties = []
@Component
export default class HasuraTableTree extends Mixins(HasuraMixin) {
  @Prop({ type: Array, default: () => [] }) list?: []
  selectedNode = null
  expandedNodes = []

  // TODO the two following computed value + method may be put in a mixin
  get itemLabelTemplate() {
    return '{{name}}' // TODO
  }

  itemLabel(item = {}) {
    var template = Handlebars.compile(this.itemLabelTemplate)
    return template(item)
  }
}
</script>
