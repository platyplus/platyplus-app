<template lang="pug">
q-page(v-if="$authenticated" padding class="justify-center")
  div(v-if="$profile.preferred_org_unit" v-t="{path: 'location.message', args: {location: $profile.preferred_org_unit.name}}")
  div(v-t="'location.select'")
  q-btn(v-for="(item, key) in list" :key="key"
    @click='selectOrgUnit(item.id)'
    :label="item.name"
    class="full-width q-mt-md")
</template>

<style></style>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { get } from 'object-path'

@Component
export default class PageCurrentOrgUnit extends Vue {
  async selectOrgUnit(id: string) {
    await this.$store.dispatch('user/udpatePreferredOrgUnit', id)
    this.$store.dispatch('navigation/route', {
      path: this.$from ? this.$from.path : '/profile/current-org-unit'
    })
  }

  get list() {
    const preferredOrgUnitId = get(this.$profile, 'preferred_org_unit.id')
    if (this.$profile.org_unit_memberships) {
      return this.$profile.org_unit_memberships
        .map(item => item.org_unit)
        .filter(item => item.id !== preferredOrgUnitId)
    } else return []
  }
}
</script>
