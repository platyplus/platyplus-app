<template lang="pug">
div
  h-collection-dispatcher(:table="table" :list="list")
  q-page-sticky(position="bottom-right" :offset="[18, 18]")
    q-btn(v-if="metadata.canInsert" :to="table+'/create'" fab icon="fas fa-plus" color="primary" )
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'
import { setTitle } from '../../../common'
import { tableProps, useMetadata, useListLoader } from '../../../metadata'

export default createComponent({
  props: { ...tableProps },
  setup(props) {
    setTitle(props.table + '.label_plural')
    const metadata = useMetadata(props)
    const list = useListLoader(metadata)
    return { list, metadata }
  }
})
</script>
