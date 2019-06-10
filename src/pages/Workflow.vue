<template lang="pug">
  q-page(padding class="justify-center")
    div(v-if="entryMode")
      q-field Search/List
      q-field Available forms
      q-list
        div(v-for="stage in initialStages" :key="stage.id")
          q-list-header(v-if="initialStages.length>1") {{stage.name}}
          q-item(v-for="node in stage.encounter_types" :key="node.id" :to="'/org-unit/'+org_unit_id+'/stage/'+stage.id+'/encounter-type/'+node.encounter_type.id+'/create'") {{node.encounter_type.title_create}}
    div(v-else)
      div(v-if="details")
        q-field(
          icon="fas fa-tag"
          label="Name")
          q-input(
            :readonly="reading"
            v-model="form.name"
            ref="firstInput"
            @keyup.enter="save")
        q-field(
          v-if="reading"
          icon="fas fa-play"
          label="Stages")
          q-list(
            v-if="item.stages.length"
            highlight)
            q-item(
              v-for="stage in item.stages"
              :to="'/workflow/'+item.id+'/stage/'+stage.id"
              :key="stage.id") {{ stage.name }}
          q-btn(label="Create stage" :to="'/workflow/'+item.id+'/stage/create'")
        q-field(
          icon="fas fa-sitemap"
          label="Available in"
          helper="")
          q-select(
            :readonly="reading"
            filter
            multiple
            chips
            v-model="relations.org_units"
            :options="options('org_units')")
      q-list(
        v-else-if="list.length"
        highlight)
        q-item(
          v-for="item in list"
          :to="'/workflow/'+item.id"
          :key="item.id") {{ item.name }}
      button-bar(:reading="reading" :details="details" @create="create" @edit="edit" @save="save" @reset="reset" @cancel="cancel" @remove="remove")
</template>

<style>
</style>

<script>
import { mixin } from 'plugins/form'

export default {
  name: 'PageWorkflow',
  mixins: [mixin('workflow')],
  props: ['org_unit_id'],
  computed: {
    entryMode () {
      return this.org_unit_id !== undefined
    },
    initialStages () {
      if (!this.item.stages) return []
      return this.item.stages.filter(item => item.previous.length === 0)
    },
    initialEncounterTypes () {
      // TODO: implement the filtering by org unit type?
      return this.initialStages.map(item => item.encounter_types)
    }
  },
  methods: {
    reset () {
      this._resetItem()
      if (this.org_unit_id) this.item.org_unit_id = this.org_unit_id // TODO: any way to put such kind of line as part of the mixin?
      this._resetForm()
    }
  }
}
</script>
