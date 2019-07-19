<template lang="pug">
  q-page(padding class="justify-center")
    div(v-if="details")
      p-input(v-model="form.name" form="org_unit" name="name" :readonly="reading"
        ref="firstInput"
        :enter="save")
      p-select(v-model="form.parent_id" form="org_unit" name="parent" :readonly="reading || Boolean(parent_id)"
        :options="options('parent')")
      p-select(v-model="form.type_id" form="org_unit" name="type" :readonly="reading"
        required
        :options="options('type')")
      p-list-field(v-model="children" form="org_unit" name="children"
        path="/org-unit"
        :create-suffix="item.id"
        v-if="reading")
      p-list-field(v-model="item.role_attributions" form="org_unit" name="role_attributions"
        :path="'/org-unit/'+item.id+'/attribution'"
        :item-label-template="'{{ user.username }} as {{ role.name }}'"
        v-if="reading")
      p-select(v-model="relations.workflows" form="org_unit" name='workflows' :readonly="reading"
        multiple :options="options('workflows')")
    q-tree(v-else-if="children.length"
      :nodes="children"
      node-key="id"
      label-key="name"
      :selected.sync="selectedNode"
      :expanded.sync="expandedNodes")
    p-button-bar(:reading="reading" :details="details" @create="create" @edit="edit" @save="save" @reset="reset" @cancel="cancel" @remove="remove" :deletionConfirmed="deletionConfirmed")
</template>

<style>
</style>

<script>
import { mixin } from 'boot/form'

export default {
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
}
</script>
