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
import { Component, Mixins } from 'vue-property-decorator'
import { CollectionContainerMixin } from 'src/mixins'

// TODO review the way the graphql query is built to get children's children (e.g. org unit)
// TODO: OR: scan the list through a computed field and add the missing children properties = []
@Component
export default class Tree extends Mixins(CollectionContainerMixin) {
  selectedNode = null
  expandedNodes = []

  itemLabel(item = {}) {
    return this.tableClass.label(item)
  }
}
</script>
