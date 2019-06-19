<template lang="pug">
  q-page(padding class="justify-center")
    div(v-if="user.preferred_org_unit" v-t="{path: 'location.message', args: {location: user.preferred_org_unit.name}}")
    div(v-t="'location.select'")
    q-btn(
      v-for="(item, key) in list" :key="key"
      @click='selectOrgUnit(item.id)'
      :label="item.name"
      class="full-width q-mt-md"
      )
</template>

<style>
</style>

<script>
import { upsertMutation } from 'boot/hasura'
export default {
  name: 'PageCurrentOrgUnit',
  methods: {
    async selectOrgUnit (id) {
      await upsertMutation({
        apollo: this.$apollo,
        table: 'user',
        update: 'update_preferred_org_unit',
        data: {
          id: this.user.id,
          preferred_org_unit_id: id
        }
      })
      this.$store.dispatch('navigation/route', {
        path: this.$from ? this.$from.path : '/profile/current-org-unit'
      })
    }
  },
  computed: {
    list () {
      return this.user.org_unit_memberships
        ? this.user.org_unit_memberships
          .map(item => item.org_unit)
          .filter(item => item.id !== this.user.preferred_org_unit_id)
        : []
    }
  }
}
</script>
