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
        label="Form")
        json-editor(
          :readonly="reading"
          :onChange="onChange"
          :json="form.form")
      q-field(label="Entity type" helper="Pick an entity type")
        q-select(:readonly="reading" clearable v-model="form.entity_type_id" :options="options('entity_type')")
    q-list(
      v-else-if="list.length"
      highlight)
      q-item(
        v-for="item in list"
        :to="'/encounter-type/'+item.id"
        :key="item.id") {{ item.name }} (TODO: group by entity type)
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
  methods: {
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
    },
    onChange (newJson) {
      // handle json changes
      this.form.form = newJson
    }
  }
}
</script>
