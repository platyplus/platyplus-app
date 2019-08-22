<template lang="pug">
h-list-dispatcher(:tableClass="tableClass" :list="list")
</template>

<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator'
import { ListLoaderMixin } from 'src/boot/hasura'
import ListDispatcher from './ListDispatcher.vue'

@Component({
  components: {
    'h-list-dispatcher': ListDispatcher
  }
})
export default class ListLoader extends Mixins(ListLoaderMixin) {}
</script>
