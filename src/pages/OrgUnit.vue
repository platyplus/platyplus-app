<template lang="pug">
  q-page(padding class="justify-center")
    q-list(v-if="!createFlag && children.length" highlight)
      q-item(v-for="item in children" :to="'/org-unit/'+item.id" :key="item.id") {{ item.name }}
    q-btn(v-if="reading && item.children" label="Create child" @click="createChild")
    div(v-if="details")
      q-field(label="Name")
        q-input(:readonly="reading" v-model="form.name" ref="firstInput" @keyup.enter="save")
      q-field(label="Parent org unit" helper="Pick an org unit")
        q-select(:readonly="reading || Boolean(parent_id)" clearable filter v-model="form.parent_id" :options="parentOptions")
      q-field(label="Type" helper="Pick an org unit type")
        q-select(:readonly="reading" clearable v-model="form.type_id" :options="typeOptions")
    button-bar(:reading="reading" :details="details" @create="create" @edit="edit" @save="save" @reset="reset" @cancel="cancel" @remove="remove")
</template>

<style>
</style>

<script>
import { smartQueryHelper } from 'plugins/hasura'
import { mixin } from 'plugins/form'

export default {
  name: 'PageOrgUnit',
  mixins: [mixin({ table: 'org_unit' })],
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
    save () {
      this._mixinPreSave().then(res => {
        if (this.parent_id) {
          this.$router.replace(
            this.$route.path.replace(`${this.parent_id}/create`, res.id)
          )
        } else {
          this._mixinPostSave()
        }
      })
    }
  },
  apollo: {
    list: smartQueryHelper({
      table: 'org_unit',
      where: { parent_id: { _is_null: true } }
    }),
    orgUnits: smartQueryHelper({
      table: 'org_unit'
    }),
    types: smartQueryHelper({ table: 'org_unit_type' })
  },
  computed: {
    children () {
      return this.item.children || this.list
    },
    typeOptions () {
      return this.types.map(item => ({
        value: item.id,
        label: item.name
      }))
    },
    parentOptions () {
      return this.orgUnits
        .filter(item => item.id !== this.item.id)
        .map(item => ({ value: item.id, label: item.name }))
    }
  },
  created () {
    if (this.parent_id) {
      this.item.parent_id = this.parent_id
      this.reset()
    }
  },
  watch: {
    $route () {
      if (this.parent_id) {
        this.item.parent_id = this.parent_id
        this.reset()
      }
    }
  }
}
</script>
