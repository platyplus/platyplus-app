<template lang="pug">
component(:is="componentName" :table="table" :list="list")
</template>

<script lang="ts">
import { createComponent, computed } from '@vue/composition-api'
import { listProps } from '../../../metadata'

export default createComponent({
  props: {
    ...listProps,
    type: { type: String, default: 'simple-list' }
  },
  setup(props, context) {
    const componentName = computed(() => {
      const possibleComponentName = `h-${props.type}-${props.table}`
      if (
        context.root.$options.components &&
        Object.keys(context.root.$options.components).includes(
          possibleComponentName
        )
      )
        return possibleComponentName
      // TODO if type is tree then return 'h-tree'
      return `h-${props.type}`
    })
    return { componentName }
  }
})
</script>
