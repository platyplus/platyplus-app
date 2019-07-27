<template lang="pug">
  q-page(padding class="justify-center")
    div(v-if="details")
      p-input(v-model="form.name" form="encounter_type" name="name" :readonly="reading"
        autofocus)
      p-input(v-model="form.title_create" form="encounter_type" name="title_create" :readonly="reading")
      p-input(v-model="form.encounter_title" form="encounter_type" name="encounter_title" :readonly="reading")
      p-select(v-model="relations.isolated_uses" form="encounter_type" name="isolated_uses" :readonly="reading"
        multiple :options="options('isolated_uses')")
      p-select(v-model="form.entity_type_id" form="encounter_type" name="entity_type" :readonly="reading"
        required
        :options="options('entity_type')")
      p-json-input(v-model="form.encounter_schema" form="encounter_type" name="encounter_schema" :readonly="reading")
    q-list(
      v-else-if="list && list.length"
      highlight)
      template(v-for="category, label in listByType")
        q-item-label(header) {{label}}
        q-item(
          v-for="item in category"
          :to="'/encounter-type/'+item.id"
          :key="item.id") {{ item.name }}
    p-button-bar(:reading="reading" :details="details" @create="create" @edit="edit" @save="save" @reset="reset" @cancel="cancel" @remove="remove" :deletionConfirmed="deletionConfirmed")
</template>

<style>
</style>

<script>
import { mixin } from 'boot/form'
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
    // async save (e) {
    //   this.form.encounter_schema.title = this.form.name
    //   const save = await this._save()
    //   if (save) this._postSave(save)
    // }
  }
}
</script>
