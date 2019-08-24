<template lang="pug">
h-collection-dispatcher(:tableClass="tableClass" :list="list")
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
