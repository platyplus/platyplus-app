<template lang="pug">
  q-page(padding class="justify-center")
    div(v-if="details")
      div(v-if="reading")
        vue-form-generator(:schema="roEntitySchema" :model="item.state.entity.attributes" :options="formOptions")
        vue-form-generator(:schema="roSchema" :model="item.encounter.data" :options="formOptions")
      div(v-else-if="encounter_type")
        vue-form-generator(:schema="encounter_type.entityForm" :model="form.state.entity.attributes" :options="formOptions")
        vue-form-generator(:schema="encounter_type.form" :model="form.encounter.data" :options="formOptions")
    q-list(
      v-else-if="list && list.length"
      highlight)
      q-item(
        v-for="item in list"
        :to="'/encounter-state/'+item.id"
        :key="item.id") {{ item.id }}
    button-bar(:reading="reading" :details="details" @create="create" @edit="edit" @save="save" @reset="reset" @cancel="cancel" @remove="remove")
</template>

<style scoped>
</style>

<script>
import { mixin } from 'plugins/form'
import { makeReadOnly, prepareForm } from 'plugins/formGenerator'
import { mutations, queries } from 'plugins/platyplus/data/encounterState'
export default {
  name: 'PageEncounter',
  mixins: [mixin('encounter_state')],
  data: () => ({
    formOptions: {
      // TODO: dig into that
      validateAfterLoad: true,
      validateAfterChanged: true,
      validateAsync: true
    },
    roSchema: {},
    roEntitySchema: {}
  }),
  props: ['org_unit_id', 'type_id', 'stage_id'],
  computed: {
    /**
     * Returns the encounter type, either from the encounter
     * (when the encounter exists, i.e. not when creating one)
     * or from Apollo through the path props
     */
    encounter_type () {
      return this.item.encounter.type || this._encounter_type
    }
  },
  methods: {
    async save () {
      if (this.id) {
        const result = await this.$apollo
          .mutate({
            mutation: mutations.update,
            variables: {
              data: this.form.encounter.data,
              attributes: this.form.state.entity.attributes,
              encounter_state_id: this.id
            },
            update: data => {
              // TODO: update cache
            }
          })
          .then(({ data }) => data.update_encounter.returning[0])
        this._postSave(result) // TODO:route back to where it should go
      } else {
        const result = await this.$apollo
          .mutate({
            mutation: mutations.insert,
            variables: {
              data: this.form.encounter.data,
              attributes: this.form.state.entity.attributes,
              encounter_type_id: this.type_id,
              entity_type_id: this.encounter_type.entity_type_id,
              stage_id: this.stage_id,
              org_unit_id: this.org_unit_id
            },
            update: data => {
              // TODO: update cache
            }
          })
          .then(({ data }) => data.insert_encounter_state.returning[0]) // TODO: wrong object returned
        this._postSave(result) // TODO: route back to where it should go
      }
    },
    // TODO: delete: un peu plus compliqué que d'habitude
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
      if (this.org_unit_id) this.item.org_unit_id = this.org_unit_id
      this._resetForm()
    }
  },
  watch: {
    /**
     * Prepares the several forms.
     * Triggerred when the encounter type is available
     */
    encounter_type (newValue) {
      if (newValue) {
        this.roSchema = makeReadOnly(newValue.form)
        this.roEntitySchema = makeReadOnly(newValue.entityForm)
        prepareForm(
          this.encounter_type.entityForm,
          this.form.state.entity.attributes
        )
        prepareForm(this.encounter_type.form, this.item.encounter.data)
      }
    }
  },
  apollo: {
    /**
     * Loads the encounter type from the path, but don't load if not present
     */
    _encounter_type: {
      query: queries.form,
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
