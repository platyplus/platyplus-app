<template lang="pug">
div
  h-collection-dispatcher(:tableClass="tableClass" :list="list")
  q-page-sticky(position="bottom-right" :offset="[18, 18]")
    q-btn(v-if="$can('insert', tableClass.name)" :to="tableClass.name+'/create'" fab icon="fas fa-plus" color="primary" )
</template>

<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator'
import { CollectionLoaderMixin } from '../../mixins'
import Dispatcher from './Dispatcher.vue'

@Component({
  components: {
    'h-collection-dispatcher': Dispatcher
  }
})
export default class CollectionLoader extends Mixins(CollectionLoaderMixin) {}
</script>
