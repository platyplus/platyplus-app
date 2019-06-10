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
        label="Isolated uses"
        helper="")
        q-select(
          :readonly="reading"
          filter
          multiple
          chips
          v-model="relations.isolated_uses"
          :options="options('isolated_uses')")
      q-field(label="Entity type" helper="Pick an entity type")
        q-select(:readonly="reading" clearable v-model="form.entity_type_id" :options="options('entity_type')")
      q-field(
        label="Encounter schema")
        json-input(v-model="form.encounter_schema" :readonly="reading")
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
  props: ['entity_type_id'],
  computed: {
    listByType () {
      return this.list.reduce((acc, curr) => {
        const name = (curr.entity_type && curr.entity_type.name) || 'None'
        if (!acc[name]) acc[name] = []
        acc[name].push(curr)
        return acc
      }, {})
    }
  },
  methods: {
    reset () {
      this._resetItem()
      if (this.entity_type_id) this.item.entity_type_id = this.entity_type_id
      this._resetForm()
    }
  }
}
</script>
