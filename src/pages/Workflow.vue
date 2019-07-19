<template lang="pug">
  q-page(padding class="justify-center")
    div(v-if="entryMode")
      div Search/List
      div Available forms
      q-list(v-if="initialStages.length")
        template(v-for="stage, numStage in initialStages")
          q-separator(v-if="numStage")
          q-item-label(header) {{stage.name}}
          q-item(v-for="node in stage.encounter_types" :key="node.id" :to="'/org-unit/'+org_unit_id+'/stage/'+stage.id+'/encounter-type/'+node.encounter_type.id+'/create'") {{node.encounter_type.title_create}}
    div(v-else)
      div(v-if="details")
        p-input(v-model="form.name" form="workflow" name="name" :readonly="reading"
          autofocus :enter="save")
        p-list-field(v-model="item.stages" form="workflow" name="stages"
          :path="'/workflow/'+item.id+'/stage'"
          v-if="reading")
        p-select(v-model="relations.org_units" form="workflow" name="org_units" :readonly="reading"
          multiple :options="options('org_units')")
      q-list(
        v-else-if="list.length"
        highlight)
        q-item(
          v-for="item in list"
          :to="'/workflow/'+item.id"
          :key="item.id") {{ item.name }}
      p-button-bar(:reading="reading" :details="details" @create="create" @edit="edit" @save="save" @reset="reset" @cancel="cancel" @remove="remove" :deletionConfirmed="deletionConfirmed")
</template>

<style>
</style>

<script>
import { mixin } from 'boot/form'

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
