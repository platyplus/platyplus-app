<template lang="pug">
  q-page(padding class="justify-center")
    div(v-if="details")
      q-input(
        label="Name"
        :readonly="reading"
        v-model="form.name"
        ref="firstInput"
        @keyup.enter="save")
      q-input(
        label="Creation title"
        :readonly="reading"
        v-model="form.title_create")
      q-select(
        label="Isolated uses"
        helper=""
        :readonly="reading"
        v-model="relations.isolated_uses"
        :options="options('isolated_uses')"
        option-value="id"
        option-label="name"
        filter
        multiple
        use-chips
        stack-label
        emit-value
        map-options)
      q-select(
        label="Entity type"
        helper="Pick an entity type"
        :readonly="reading"
        v-model="form.entity_type_id"
        :options="options('entity_type')"
        option-value="id"
        option-label="name"
        clearable)
      json-input(label="Encounter schema" v-model="form.encounter_schema" :readonly="reading")
    q-list(
      v-else-if="list.length"
      highlight)
      template(v-for="category, label in listByType")
        q-item-label(header) {{label}}
        q-item(
          v-for="item in category"
          :to="'/encounter-type/'+item.id"
          :key="item.id") {{ item.name }}
    button-bar(:reading="reading" :details="details" @create="create" @edit="edit" @save="save" @reset="reset" @cancel="cancel" @remove="remove" :deletionConfirmed="deletionConfirmed")
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
  }
}
</script>
