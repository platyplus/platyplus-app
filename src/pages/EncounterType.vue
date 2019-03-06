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
      q-field(
        label="Entity schema")
        codemirror(v-model="jsonEntityForm" :options="cmOptions")
      q-field(
        label="State schema")
        codemirror(v-model="jsonStateForm" :options="cmOptions")
      q-field(
        label="Encounter schema")
        codemirror(v-model="jsonEncounterForm" :options="cmOptions")
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
    // TODO: use directly this.form instead of separate data values?
    jsonEntityForm: '',
    jsonStateForm: '',
    jsonEncounterForm: ''
  }),
  props: ['entity_type_id'],
  computed: {
    listByType () {
      return this.list.reduce((acc, curr) => {
        if (!acc[curr.entity_type.name]) acc[curr.entity_type.name] = []
        acc[curr.entity_type.name].push(curr)
        return acc
      }, {})
    },
    cmOptions () {
      if (this.reading) {
        return {
          readOnly: 'nocursor',
          styleActiveLine: false
        }
      } else {
        return {
          readOnly: false,
          styleActiveLine: true
        }
      }
    }
  },
  methods: {
    async save () {
      this.form.entity_schema = JSON.parse(this.jsonEntityForm)
      this.form.state_schema = JSON.parse(this.jsonStateForm)
      this.form.encounter_schema = JSON.parse(this.jsonEncounterForm)
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
    resetForm () {
      if (this.entity_type_id) this.item.entity_type_id = this.entity_type_id
      this.jsonEntityForm = JSON.stringify(this.item.entity_schema, null, 2)
      this.jsonStateForm = JSON.stringify(this.item.state_schema, null, 2)
      this.jsonEncounterForm = JSON.stringify(
        this.item.encounter_schema,
        null,
        2
      )
      this._resetForm()
    }
  }
}
</script>
