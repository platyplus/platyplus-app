<template lang="pug">
  q-page(padding class="justify-center")
    div(v-if="details")
      q-field(
        label="Name")
        q-input(
          :readonly="reading"
          v-model="form.id"
          ref="firstInput"
          @keyup.enter="save")
    q-list(
      v-else-if="list && list.length"
      highlight)
      q-item(
        v-for="item in list"
        :to="'/encounter/'+item.id"
        :key="item.id") {{ item.id }}
    button-bar(:reading="reading" :details="details" @create="create" @edit="edit" @save="save" @reset="reset" @cancel="cancel" @remove="remove")
</template>

<style>
</style>

<script>
import { mixin } from 'plugins/form'
import { save } from 'plugins/hasura'

export default {
  name: 'PageEncounter',
  mixins: [mixin('encounter')],
  data: () => ({
    // jsonForm: {}
  }),
  props: ['org_unit_id', 'type_id', 'stage_id', 'entity_id'],
  methods: {
    async save () {
      let attributes = {
        // TODO: mock attributes
        first_name: 'Roger',
        last_name: 'Spok'
      }
      const entity = await save({
        apollo: this.$apollo,
        table: 'entity',
        // TODO: send attributes data & check it does not erase the previous entire JSONB
        // TODO: entity type (type_id) from encounter_type.entity_type.id
        newValues: { id: this.item.entity_id, attributes }
      })
      let data = {
        // TODO: mock data
        blood_pressure: 200
      }
      this.form.id = entity.id
      this.form.data = data
      await this._preSave()
      this._postSave() // TODO: route back to where it should go
    },
    // cancel () {
    //   this.$router.replace(
    //     this.$route.path.replace(
    //       this.createFlag ? '/encounter/create' : '/edit',
    //       ''
    //     )
    //   )
    // },
    reset () {
      this._resetItem()
      if (this.type_id) this.item.type_id = this.type_id
      if (this.entity_id) this.item.entity_id = this.entity_id
      if (this.org_unit_id) this.item.org_unit_id = this.org_unit_id
      this._resetForm()
    }
    // onChange (newJson) {
    //   this.jsonForm = newJson
  }
}
</script>
