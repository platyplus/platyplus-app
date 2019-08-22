<template lang="pug">
component(:is="componentName" :tableClass="tableClass" :list="list")
</template>

<script lang="ts">
import { Mixins, Component, Prop } from 'vue-property-decorator'
import Handlebars from 'handlebars'
import { HasuraMixin } from 'src/boot/hasura'
import List from './List.vue'
import Tree from './Tree.vue'
import Chips from './ListChips.vue'

@Component({
  components: {
    'h-list': List,
    'h-tree': Tree,
    'h-chips': Chips
  }
})
export default class ListDispatcher extends Mixins(HasuraMixin) {
  @Prop({ type: Array, default: () => [] }) list?: []
  @Prop({ type: String, default: 'list' }) type?: string

  get itemLabelTemplate() {
    return '{{name}}' // TODO
  }

  itemLabel(item = {}) {
    const template = Handlebars.compile(this.itemLabelTemplate)
    return template(item)
  }
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
