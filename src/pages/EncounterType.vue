<template lang="pug">
  q-page(padding class="justify-center")
    div(v-if="details")
      q-field(
        label="Name")
        q-input(
          :readonly="reading"
          v-model="form.name"
          ref="firstInput"
          @keyup.enter="save")
      q-field(
        label="Creation title")
        q-input(
          :readonly="reading"
          v-model="form.title_create"
          ref="firstInput")
      q-field(
        label="Entity form")
        json-editor(
          :readonly="reading"
          :onChange="onEntityFormChange"
          :json="form.entityForm")
      q-field(
        label="Encounter form")
        json-editor(
          :readonly="reading"
          :onChange="onFormChange "
          :json="form.form")
      q-field(
        label="Available for stages"
        helper="")
        q-select(
          :readonly="reading"
          filter
          multiple
          chips
          v-model="relations.stages"
          :options="options('stages')")
      q-field(label="Entity type" helper="Pick an entity type")
        q-select(:readonly="reading" clearable v-model="form.entity_type_id" :options="options('entity_type')")
    q-list(
      v-else-if="list.length"
      highlight)
      div(v-for="category, label in listByType")
        q-list-header {{label}}
        q-item(
          v-for="item in category"
          :to="'/encounter-type/'+item.id"
          :key="item.id") {{ item.name }}
    button-bar(:reading="reading" :details="details" @create="create" @edit="edit" @save="save" @reset="reset" @cancel="cancel" @remove="remove")
</template>

<style>
</style>

<script>
import { mixin } from 'plugins/form'

export default {
  name: 'PageEncounterType',
  mixins: [mixin('encounter_type')],
  data: () => ({
    jsonForm: {},
    jsonEntityForm: {}
  }),
  props: ['entity_type_id'],
  computed: {
    listByType () {
      return this.list.reduce((acc, curr) => {
        if (!acc[curr.entity_type.name]) acc[curr.entity_type.name] = []
        acc[curr.entity_type.name].push(curr)
        return acc
      }, {})
    }
  },
  methods: {
    async save () {
      this.form.form = this.jsonForm
      this.form.entityForm = this.jsonEntityForm
      await this._save()
      this._postSave()
    },
    cancel () {
      this.$router.replace(
        this.$route.path.replace(
          this.createFlag ? '/encounter-type/create' : '/edit',
          ''
        )
      )
    },
    reset () {
      this._resetItem()
      if (this.entity_type_id) this.item.entity_type_id = this.entity_type_id
      this._resetForm()
      this.jsonForm = this.form.form
      this.jsonEntityForm = this.form.entityForm
    },
    onFormChange (newJson) {
      this.jsonForm = newJson
    },
    onEntityFormChange (newJson) {
      this.jsonEntityForm = newJson
    }
  }
}
</script>
