<template lang="pug">
  q-page(padding class="justify-center")
    router-view
</template>

<style>
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class PageOrgUnit extends Vue {}
// TODO TS
/*
export default Vue.extend({
  name: 'PageOrgUnit',
  mixins: [mixin('org_unit', { where: { parent_id: { _is_null: true } } })],
  props: ['parent_id'],
  data: () => ({
    types: [],
    orgUnits: [],
    selectedNode: null,
    expandedNodes: []
  }),
  methods: {
    async save () {
      const { id } = await this._save()
      if (this.parent_id) {
        this.$router.replace(
          this.$route.path.replace(`${this.parent_id}/create`, id)
        )
      } else {
        this._postSave()
      }
    },
    reset () {
      this._resetItem()
      if (this.parent_id) this.item = { parent_id: this.parent_id }
      this._resetForm()
    }
  },
  computed: {
    children () {
      return this.item.children || this.list
    }
  },
  watch: {
    selectedNode (newValue) {
      if (newValue) {
        this.$router.push('/org-unit/' + newValue)
      }
    }
  },
  updated () {
    this.selectedNode = null // Unselect the node when we reload the component
  }
})
*/
</script>
