<template lang="pug">
  q-page(padding class="justify-center")
    div(v-if="details && encounter_type")
      p-survey(:schema="encounter_type.encounter_schema" v-model="form.data" :readonly="reading"
        @save="save" @reset="reset" @cancel="cancel")
    q-list(
      v-else-if="list && list.length"
      highlight)
      q-item(
        v-for="item in list"
        :to="'/encounter/'+item.id"
        :key="item.id") {{item.id}}
    p-button-bar(:reading="reading" :details="details" @create="create" @edit="edit" @remove="remove" :deletionConfirmed="deletionConfirmed")
</template>

<style scoped>
</style>

<script>
import { mixin } from 'boot/form'
import { queries } from 'boot/platyplus'
// TODO: on load, merge all data into one property, and then dispatch on save
export default {
  name: 'PageEncounter',
  mixins: [mixin('encounter')],
  props: ['org_unit_id', 'type_id'],
  computed: {
    listVariables () {
      return {
        where: {
          type_id: {
            _eq: this.type_id
          },
          org_unit_id: {
            _eq: this.org_unit_id
          }
        }
      }
    },
    /**
     * @returns the encounter type, either from the encounter
     * (when the encounter exists, i.e. not when creating one)
     * or from Apollo through the path props
     */
    encounter_type () {
      return this.item.type || this._encounter_type
    }
  },
  methods: {
    async save () {
      const newValues = {
        id: this.id,
        data: this.form.data,
        type_id: this.type_id,
        org_unit_id: this.org_unit_id
        // entity_type_id: this.encounter_type.entity_type_id
      }
      const save = await this._save({ newValues })
      if (save) this._postSave(save)
    },
    // TODO: delete: un peu plus compliqué que d'habitude
    reset () {
      this._resetItem()
      if (this.type_id) this.item.type_id = this.type_id
      if (this.org_unit_id) this.item.org_unit_id = this.org_unit_id
      this._resetForm()
    }
  },
  apollo: {
    /**
     * Loads the encounter type from the path, but don't load if not present
     */
    _encounter_type: {
      query: queries.encounter_type.form,
      variables () {
        return {
          where: { id: { _eq: this.type_id } }
        }
      },
      skip () {
        return !this.type_id
      },
      update: data => data[Object.keys(data)[0]][0]
    }
  }
}
</script>
