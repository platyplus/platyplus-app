<template lang="pug">
div
  h-collection-dispatcher(:table="table" :list="list")
  q-page-sticky(position="bottom-right" :offset="[18, 18]")
    q-btn(v-if="metadata.canInsert" :to="table+'/create'" fab icon="fas fa-plus" color="primary" )
</template>

<script lang="ts">
import { createComponent, watch } from '@vue/composition-api'
import { useStore } from '../../../common'
import { tableProps, useMetadata, useListLoader } from '../../../metadata'

export default createComponent({
  props: { ...tableProps },
  setup(props) {
    const store = useStore()
    watch(
      () => props.table,
      () => {
        store.commit('navigation/setTitle', {
          label: props.table + '.label_plural',
          translate: true
        })
      }
    )
    const metadata = useMetadata(props)
    const list = useListLoader(metadata)
    return { list, metadata }
  }
})
</script>
