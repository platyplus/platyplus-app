<template lang="pug">
div
  h-collection-dispatcher(:tableClass="tableClass" :list="list")
  q-page-sticky(position="bottom-right" :offset="[18, 18]")
    q-btn(v-if="$can('insert', tableClass.name)" :to="tableClass.name+'/edit'" fab icon="fas fa-plus" color="primary" )
</template>

<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator'
import { CollectionLoaderMixin } from 'src/boot/hasura'
import CollectionDispatcher from './CollectionDispatcher.vue'

@Component({
  components: {
    'h-collection-dispatcher': CollectionDispatcher
  }
})
export default class CollectionLoader extends Mixins(CollectionLoaderMixin) {}
</script>
