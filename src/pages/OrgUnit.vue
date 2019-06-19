<template lang="pug">
  q-page(padding class="justify-center")
    div(v-if="details")
      q-input(label="Name" :readonly="reading" v-model="form.name" ref="firstInput" @keyup.enter="save")
      q-separator
      q-select(
        label="Parent org unit"
        helper="Pick an org unit"
        stack-label
        emit-value
        map-options
        :readonly="reading || Boolean(parent_id)"
        clearable
        filter
        v-model="form.parent_id"
        :options="options('parent')")
      q-separator
      q-field(
        v-if="reading"
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
      q-select(label="Type" helper="Pick an org unit type" :readonly="reading" clearable v-model="form.type_id" :options="options('type')")
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
      q-select(
        icon="fas fa-route"
        label="Available workflows"
        helper=""
        stack-label
        emit-value
        map-options
        :readonly="reading"
        filter
        multiple
        chips
        v-model="relations.workflows"
        :options="options('workflows')")
    q-list(v-else-if="children.length" highlight)
      q-item(v-for="item in children" :to="'/org-unit/'+item.id" :key="item.id") {{ item.name }}
    button-bar(:reading="reading" :details="details" @create="create" @edit="edit" @save="save" @reset="reset" @cancel="cancel" @remove="remove")
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
    orgUnits: []
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
  }
}
</script>
