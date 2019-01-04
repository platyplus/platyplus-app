<template lang="pug">
  q-page(padding class="justify-center")
    q-field(
      icon="fas fa-user"
      label="User name")
      div {{form.username}}
    q-field(
      icon="fas fa-calendar"
      label="Member since")
      div {{form.created_at | moment("DD/MM/YYYY HH:mm") }}
    q-field(
      icon="fas fa-user"
      label="First name"
      :error="errors.has('attributes.first_name')"
      :error-label="errors.first('attributes.first_name')")
      q-input(
        :readonly="reading"
        v-model="form.attributes.first_name"
        ref="firstInput"
        @keyup.enter="save"
        v-validate="validate('attributes.first_name')"
        name="attributes.first_name")
    q-field(
      icon="fas fa-user"
      label="Last name")
      q-input(
        :readonly="reading"
        v-model="form.attributes.last_name"
        @keyup.enter="save")
    q-field(
      icon="fas fa-sitemap"
      label="Membership"
      helper="Pick org units")
      q-select(
        :readonly="reading"
        filter
        multiple
        chips
        v-model="relations.org_unit_memberships"
        :options="options('org_unit_memberships')")
    q-field(
      icon="fas fas fa-location-arrow"
      label="Preferred org unit"
      helper="Pick an org unit")
      q-select(
        :readonly="reading"
        clearable
        v-model="form.preferred_org_unit_id"
        :options="preferredOrgUnitOptions")
    button-bar(
      :reading="reading"
      :details="details"
      :disableSave="errors.count()"
      @edit="edit"
      @save="save"
      @reset="reset"
      @cancel="cancel")
</template>

<style>
</style>
<script>
import { mixin } from 'plugins/form'
export default {
  name: 'PageProfile',
  mixins: [
    mixin('user', {
      fragment: 'full',
      unique: true
    })
  ],
  methods: {
    async save (e) {
      const user = await this._preSave()
      if (user) {
        this.$store.dispatch('authentication/updateUser', user)
        this._postSave()
      }
    }
  },
  computed: {
    preferredOrgUnitOptions () {
      return this.options('org_unit_memberships').filter(item =>
        this.relations.org_unit_memberships.includes(item.value)
      )
    }
  }
}
</script>
