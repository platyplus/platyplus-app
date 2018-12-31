<template lang="pug">
  q-page(padding class="justify-center")
    q-list(v-if="!createFlag && children.length" highlight)
      q-item(v-for="item in children" :to="'/org-unit/'+item.id" :key="item.id") {{ item.name }}
    q-btn(v-if="reading && item.children" label="Create child" @click="createChild")
    div(v-if="details")
      q-field(label="Name")
        q-input(:readonly="reading" v-model="form.name" ref="firstInput" @keyup.enter="save")
      q-field(label="Parent org unit" helper="Pick an org unit")
        q-select(:readonly="reading || Boolean(parent_id)" clearable filter v-model="form.parent_id" :options="options('parent')")
      q-field(label="Type" helper="Pick an org unit type")
        q-select(:readonly="reading" clearable v-model="form.type_id" :options="options('type')")
    button-bar(:reading="reading" :details="details" @create="create" @edit="edit" @save="save" @reset="reset" @cancel="cancel" @remove="remove")
</template>

<style>
</style>

<script>
import { mixin } from 'plugins/form'

export default {
  name: 'PageOrgUnit',
  mixins: [mixin('org_unit', { where: { parent_id: { _is_null: true } } })],
  props: ['parent_id'],
  data () {
    return {
      types: [],
      orgUnits: []
    }
  },
  methods: {
    createChild () {
      this.$router.push(this.$route.path + '/create')
    },
    async save () {
      const { id } = await this._preSave()
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
