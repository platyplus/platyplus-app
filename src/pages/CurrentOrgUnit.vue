<template lang="pug">
  q-page(padding class="justify-center")
    div(v-if="user.preferred_org_unit" v-t="{path: 'location.message', args: {location: user.preferred_org_unit.name}}")
    div(v-t="'location.select'")
    q-list(link v-if="authenticated")
      q-item(v-for="(item, key) in list" :key="key" tag="label")
        q-item-side
          q-radio(v-model="selection" :val="item.id")
        q-item-section
          q-item-tile(label) {{item.name}}
    q-btn(@click='selectOrgUnit' v-t="'select'")
</template>

<style>
</style>

<script>
import { getUser } from 'boot/auth'
import { upsertMutation } from 'boot/hasura'
export default {
  name: 'PageCurrentOrgUnit',
  data: () => ({
    selection: getUser().preferred_org_unit_id || ''
  }),
  methods: {
    async selectOrgUnit () {
      if (this.selection !== '') {
        await upsertMutation({
          apollo: this.$apollo,
          table: 'user',
          update: 'update_preferred_org_unit',
          data: {
            id: this.user.id,
            preferred_org_unit_id: this.selection
          }
        })
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
