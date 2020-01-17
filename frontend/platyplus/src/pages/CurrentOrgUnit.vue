<template lang="pug">
q-page(v-if="authenticated" padding class="justify-center")
  div(v-if="profile.preferred_org_unit" v-t="{path: 'location.message', args: {location: profile.preferred_org_unit.name}}")
  div(v-t="'location.select'")
  q-btn(v-for="(item, key) in list" :key="key"
    @click='selectOrgUnit(item.id)'
    :label="item.name"
    class="full-width q-mt-md")
</template>

<style></style>

<script lang="ts">
import { createComponent, computed } from '@vue/composition-api'
import { useProfile, useAuthenticated } from '../modules/authentication'
import { useStore } from '../modules/common'

export default createComponent({
  setup() {
    const store = useStore()
    const profile = useProfile()
    const authenticated = useAuthenticated()
    const selectOrgUnit = async (id: string) => {
      await store.dispatch('authentication/udpatePreferredOrgUnit', id)
      store.dispatch('navigation/route', {
        // TODO path: this.$from ? this.$from.path : '/profile/current-org-unit'
        path: '/profile/current-org-unit'
      })
    }
    const list = computed(() => {
      const preferredOrgUnitId = profile.value?.preferred_org_unit?.id
      if (profile.value?.org_unit_memberships) {
        return profile.value.org_unit_memberships
          .map(item => item.org_unit)
          .filter(item => item.id !== preferredOrgUnitId)
      } else return []
    })
    return { store, selectOrgUnit, list, authenticated, profile }
  }
})
</script>
