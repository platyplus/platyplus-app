<template lang="pug">
q-page(v-if="$authenticated" padding class="justify-center")
  p-input(v-model="form.username" form="user" name="username" readonly)
  p-input(v-model="form.created_at" form="user" name="created_at" readonly
    v-if="reading"
    mask="date")
  p-input(v-model="form.attributes.first_name" form="user" name="first_name" :readonly="reading"
    autofocus :enter="save")
    //- // TODO  v-validate="validate('attributes.first_name')"
  p-input(v-model="form.attributes.last_name" form="user" name="last_name" :readonly="reading"
    :enter="save")
  p-select(v-model="relations.roles" form="user" name="roles" readonly
    v-if="reading"
    multiple :options="options('roles')")
  p-select(v-model="form.locale" form="user" name="language" :readonly="reading"
    required
    :options="$locales" option-value="value" option-label="label")
  p-select(v-model="relations.org_unit_memberships" form="user" name="membership" readonly
    v-if="reading"
    multiple :options="options('org_unit_memberships')")
  p-select(v-model="form.preferred_org_unit_id" form="user" name="preferred_org_unit" :readonly="reading"
    required
    :options="preferredOrgUnitOptions")
  p-list-field(v-model="item.role_attributions" form="user" name="role_attributions"
      :path="'/user/'+item.id+'/attribution'"
      :item-label-template="'{{ role.name }} in {{ org_unit.name }}'"
      v-if="reading && item.role_attributions.length")
  p-button-bar(
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
<script lang="ts">
// import { mixin } from 'boot/form'

import { Vue, Component } from 'vue-property-decorator'
@Component
export default class PageProfile extends Vue {}
// TODO TS
/*
export default Vue.extend({
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
        this.relations.org_unit_memberships.includes(item.id)
      )
    }
  }
})
*/
</script>
