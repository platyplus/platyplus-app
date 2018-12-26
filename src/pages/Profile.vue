<template lang="pug">
  q-page(padding class="justify-center")
    q-field(icon="fas fa-user" label="User name")
      div {{form.username}}
    q-field(icon="fas fa-calendar" label="Member since")
      div {{form.created_at | moment("DD/MM/YYYY HH:mm") }}
    q-field(icon="fas fa-user" label="First name")
      q-input(:readonly="reading" v-model="form.attributes.first_name" ref="firstInput" @keyup.enter="save")
    q-field(icon="fas fa-user" label="Last name")
      q-input(:readonly="reading" v-model="form.attributes.last_name" @keyup.enter="save")
    q-field(icon="fas fa-sitemap" label="Pick org units" helper="Pick org units")
      q-select(:readonly="reading" filter multiple chips v-model="relations.org_unit_memberships" :options="orgUnitOptions")
    q-field(icon="fas fa-sitemap" label="Preferred org unit" helper="Pick an org unit")
      q-select(:readonly="reading" clearable v-model="form.preferred_org_unit_id" :options="preferredOrgUnitOptions")
    button-bar(:reading="reading" :details="details" @edit="edit" @save="save" @reset="reset" @cancel="cancel")
</template>

<style>
</style>
<script>
import { smartQueryHelper } from 'plugins/hasura'
import { mixin } from 'plugins/form'
const FORM_CONFIG = {
  table: 'user',
  fragment: 'full',
  unique: true,
  relations: {
    // TODO: move to settings in the platyplus module?
    org_unit_memberships: {
      table: 'user_org_unit',
      to: 'org_unit'
    }
  },
  initialValues: {
    // TODO: move to settings in the platyplus module?
    attributes: {}
  },
  beforeSave: ({ form, initial, relations }) => {
    if (
      !form.org_unit_memberships
        .map(item => item.org_unit.id)
        .includes(form.preferred_org_unit_id)
    ) {
      form.preferred_org_unit_id = null
    }
    return { form }
  }
}
export default {
  name: 'PageProfile',
  mixins: [mixin(FORM_CONFIG)],
  data () {
    return {
      orgUnits: [] // TODO: put the options in the form mixin
    }
  },
  methods: {
    save (e) {
      this._mixinPreSave().then(user => {
        this.$store.dispatch('authentication/updateUser', user)
        this._mixinPostSave()
      })
    }
  },
  apollo: {
    orgUnits: smartQueryHelper({ table: 'org_unit' })
  },
  computed: {
    preferredOrgUnitOptions () {
      return this.orgUnitOptions.filter(item =>
        this.relations.org_unit_memberships.includes(item.value)
      )
    },
    orgUnitOptions () {
      return this.orgUnits.map(item => ({
        value: item.id,
        label: item.name
      }))
    }
  }
}
</script>
