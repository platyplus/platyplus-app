<template lang="pug">
  q-page(padding class="justify-center")
    div(v-if="details")
      div(v-if="reading")
        vue-form-generator(:schema="roEntitySchema" :model="form.entity.attributes" :options="formOptions")
        vue-form-generator(:schema="roSchema" :model="item.data" :options="formOptions")
      div(v-else-if="encounter_type")
        vue-form-generator(:schema="encounter_type.entityForm" :model="form.entity.attributes" :options="formOptions")
        vue-form-generator(:schema="encounter_type.form" :model="form.data" :options="formOptions")
    q-list(
      v-else-if="list && list.length"
      highlight)
      q-item(
        v-for="item in list"
        :to="'/encounter/'+item.id"
        :key="item.id") {{ item.id }}
    button-bar(:reading="reading" :details="details" @create="create" @edit="edit" @save="save" @reset="reset" @cancel="cancel" @remove="remove")
</template>

<style scoped>
</style>

<script>
import { mixin } from 'plugins/form'
import { save, queryHelper } from 'plugins/hasura'
import { makeReadOnly, prepareForm } from 'plugins/formGenerator'

export default {
  name: 'PageEncounter',
  mixins: [mixin('encounter')],
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
  props: ['org_unit_id', 'type_id', 'stage_id', 'entity_id'],
  computed: {
    /**
     * Returns the encounter type, either from the encounter
     * (when the encounter exists, i.e. not when creating one)
     * or from Apollo through the path props
     */
    encounter_type () {
      return this.item.type || this._encounter_type
    }
  },
  methods: {
    async save () {
      const entity = await save({
        apollo: this.$apollo,
        table: 'entity',
        // TODO: send attributes data & check it does not erase the previous entire JSONB
        newValues: {
          id: this.item.entity_id,
          attributes: this.form.entity.attributes
        }
      })
      if (!this.form.entity_id) this.form.entity_id = entity.id
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
        prepareForm(this.encounter_type.entityForm, this.form.entity.attributes)
        prepareForm(this.encounter_type.form, this.item.data)
      }
    }
  },
  apollo: {
    /**
     * Loads the encounter type from the path, but don't load if not present
     */
    _encounter_type: {
      query: queryHelper({
        table: 'encounter_type',
        fragment: 'base'
      }),
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
