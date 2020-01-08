<template lang="pug">
q-tree(v-if="list.length" highlight
  :selected.sync="selectedNode.value"
  :expanded.sync="expandedNodes.value"
  :nodes="list"
  node-key="id"
  label-key="name"
)
div(v-else)
  slot(name="empty")
</template>

<script lang="ts">
import { createComponent, ref } from '@vue/composition-api'

// TODO review the way the graphql query is built to get children's children (e.g. org unit)
// TODO: OR: scan the list through a computed field and add the missing children properties = []
export default createComponent({
  props: {
    list: { type: Array, default: () => [] }
  },
  setup() {
    const selectedNode = ref(null)
    const expandedNodes = ref([])
    return { selectedNode, expandedNodes }
  }
})
</script>
