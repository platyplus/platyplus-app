<template lang="pug">
component(:is="componentName" :tableClass="tableClass" :list="list")
</template>

<script lang="ts">
import { Mixins, Component, Prop } from 'vue-property-decorator'
import { CollectionContainerMixin } from 'src/boot/hasura'
import SimpleList from './SimpleList.vue'
import Tree from './Tree.vue'
import Chips from './ListChips.vue'

@Component({
  components: {
    'h-simple-list': SimpleList,
    'h-tree': Tree,
    'h-chips': Chips
  }
})
export default class CollectionDispatcher extends Mixins(
  CollectionContainerMixin
) {
  @Prop({ type: String, default: 'simple-list' }) public readonly type!: string

  /**
   * Returns the component name to use to render the list.
   */
  get componentName() {
    const possibleComponentName = `h-${this.type}-${this.tableName}`
    if (this.$options.components) {
      const components = Object.keys(this.$options.components)
      if (components.includes(possibleComponentName))
        return possibleComponentName
    }
    // TODO if type is tree then return 'h-tree'
    return `h-${this.type}`
  }
}
</script>
