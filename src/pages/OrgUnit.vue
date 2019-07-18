<template lang="pug">
  q-page(padding class="justify-center")
    div(v-if="details")
      p-input(v-model="form.name" form="org_unit" name="name" :readonly="reading"
        ref="firstInput"
        :enter="save")
      p-select(v-model="form.parent_id" form="org_unit" name="parent" :readonly="reading || Boolean(parent_id)"
        :options="options('parent')")
      q-field(
        v-if="reading && item.type.to.length > 0"
        label="Children"
        stack-label)
        template(v-slot:control)
          q-list(
            class="col-12"
            highlight)
            q-item(
              v-for="item in children"
              :to="'/org-unit/'+item.id"
              :key="item.id") {{ item.name }}
            q-item(:to="'/org-unit/'+item.id+'/create'")
              q-item-section(avatar)
                q-icon(name="fas fa-plus")
              q-item-section Create child
      p-select(v-model="form.type_id" form="org_unit" name="type" :readonly="reading"
        :options="options('type')")
      q-field(
        v-if="reading"
        label="Role attributions"
        stack-label)
        template(v-slot:control)
          q-list(
            class="col-12"
            highlight)
            q-item(
              v-for="role in item.role_attributions"
              :to="'/org-unit/'+item.id+'/attribution/'+role.id"
              :key="role.id") {{ role.user.username }} as {{ role.role.name }}
            q-item(:to="'/org-unit/'+item.id+'/attribution/create'")
              q-item-section(avatar)
                q-icon(name="fas fa-plus")
              q-item-section Create role attribution
      p-select(v-model="relations.workflows" form="org_unit" name='workflow' :readonly="reading"
        multiple :options="options('workflows')")
    q-tree(v-else-if="children.length"
      :nodes="children"
      node-key="id"
      label-key="name"
      :selected.sync="selectedNode"
      :expanded.sync="expandedNodes")
    button-bar(:reading="reading" :details="details" @create="create" @edit="edit" @save="save" @reset="reset" @cancel="cancel" @remove="remove" :deletionConfirmed="deletionConfirmed")
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
