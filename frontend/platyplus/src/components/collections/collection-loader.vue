<template lang="pug">
div
  h-collection-dispatcher(:table="table" :list="list")
  q-page-sticky(position="bottom-right" :offset="[18, 18]")
    q-btn(v-if="metadata.canInsert" :to="table+'/create'" fab icon="fas fa-plus" color="primary" )
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
import { setTitle } from '../../composables/navigation'
import { tableProps, useMetadata, useList } from '../../composables/metadata'

export default createComponent({
  props: {
    ...tableProps
  },
  setup(props) {
    setTitle(props.table + '.label_plural')
    const metadata = useMetadata(props)
    const list = useList(props)
    return { list, metadata }
  }
})
</script>
