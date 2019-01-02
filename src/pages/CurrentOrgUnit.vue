<template lang="pug">
  q-page(padding class="justify-center")
    div(v-if="user.preferred_org_unit") Your current unit: {{user.preferred_org_unit.name}}
    div Select the organisational unit to use:
    q-list(link)
      q-item(v-for="(item, key) in list" :key="key" tag="label")
        q-item-side
          q-radio(v-model="selection" :val="item.id")
        q-item-main
          q-item-tile(label) {{item.name}}
    q-btn(@click='selectOrgUnit') Select
</template>

<style>
</style>

<script>
import { updateMutation } from 'plugins/hasura'

export default {
  name: 'PageCurrentOrgUnit',
  data () {
    const user = this.$store.getters['authentication/user']
    return {
      selection: user.preferred_org_unit_id ? user.preferred_org_unit_id : ''
    }
  },
  methods: {
    async selectOrgUnit () {
      if (this.selection !== '') {
        const user = await updateMutation({
          apollo: this.$apollo,
          table: 'user',
          mutation: 'update_preferred_org_unit',
          data: {
            id: this.user.id,
            preferred_org_unit_id: this.selection
          },
          fragment: 'full'
        })
        this.$store.dispatch('authentication/updateUser', user)
        this.$store.dispatch('navigation/route', {
          path: this.$from ? this.$from.path : '/profile/current-org-unit'
        })
      }
    }
  },
  computed: {
    list () {
      return this.user.org_unit_memberships.map(item => item.org_unit)
    }
  }
}
</script>
