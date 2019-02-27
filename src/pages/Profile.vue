<template lang="pug">
  q-page(v-if="authenticated" padding class="justify-center")
    q-field(
      icon="fas fa-user"
      :label="$t('user.labels.username')")
      div {{form.username}}
    q-field(
      v-if="reading"
      icon="fas fa-calendar"
      :label="$t('user.labels.created_at')")
      div {{form.created_at | moment("DD/MM/YYYY HH:mm") }}
    q-field(
      icon="fas fa-user"
      :label="$t('user.labels.attributes.first_name')"
      :error="vErrors.has('attributes.first_name')"
      :error-label="vErrors.first('attributes.first_name')")
      q-input(
        :readonly="reading"
        v-model="form.attributes.first_name"
        ref="firstInput"
        @keyup.enter="save"
        v-validate="validate('attributes.first_name')"
        name="attributes.first_name")
    q-field(
      icon="fas fa-user"
      :label="$t('user.labels.attributes.last_name')")
      q-input(
        :readonly="reading"
        v-model="form.attributes.last_name"
        @keyup.enter="save")
    q-field(
      v-if="reading"
      icon="fas fa-user-lock"
      :label="$t('user.labels.roles')")
      q-select(
        readonly
        filter
        multiple
        chips
        v-model="relations.roles"
        :options="options('roles')")
    q-field(
      icon="fas fa-language"
      :label="$t('language')")
      q-select(
        :readonly="reading"
        :options="$locales"
        v-model="form.locale")
    q-field(
      v-if="reading"
      icon="fas fa-sitemap"
      :label="$t('user.labels.org_unit_memberships')"
      :helper="$t('user.helpers.org_unit_memberships')")
      q-select(
        readonly
        filter
        multiple
        chips
        v-model="relations.org_unit_memberships"
        :options="options('org_unit_memberships')")
    q-field(
      icon="fas fas fa-location-arrow"
      :label="$t('user.labels.preferred_org_unit')"
      :helper="$t('user.labels.preferred_org_unit')")
      q-select(
        :readonly="reading"
        clearable
        v-model="form.preferred_org_unit_id"
        :options="preferredOrgUnitOptions")
    q-field(
      v-if="reading"
      icon="fas fas fa-user-lock"
      label="Role attributions")
      q-list(
        v-if="item.role_attributions.length"
        highlight)
        q-item(
          v-for="role in item.role_attributions"
          :to="'/user/'+item.id+'/attribution/'+role.id"
          :key="role.id") {{ role.role.name }} in {{ role.org_unit.name }}
    button-bar(
      :reading="reading"
      :details="details"
      :disableSave="vErrors.count()"
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
      query: 'profile',
      update: 'update_profile',
      list: false
    })
  ],
  methods: {
    async save (e) {
      const user = await this._save()
      if (user) {
        if (user.locale) this.$locale = user.locale
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
