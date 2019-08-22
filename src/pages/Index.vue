<template lang="pug">
q-page(v-if="$authenticated" padding class="justify-center")
  div(v-if="$profile.preferred_org_unit" v-t="{path: 'location.message', args: {location: $profile.preferred_org_unit.name}}")
  q-list(v-if="$profile.org_unit_memberships.length > 1" highlight)
    q-item(to="/profile/current-org-unit" :exact="true")
      q-item-section(avatar icon="fas fa-location-arrow")
      q-item-section(v-t="'location.change'")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class PageIndex extends Vue {
  get canUser() {
    return this.$can('select', {
      __typename: 'user',
      id: '4edf74b7-ddb9-4da0-8022-9a30ba12503d'
    })
  }
  get canOther() {
    return this.$can('select', {
      __typename: 'user',
      id: '12345678-abcd-1234-5678-a1b2c3d4e5f6'
    })
  }
  get canGeneral() {
    return this.$can('select', 'user')
  }
  get canIdiot() {
    return this.$can('select', 'zou')
  }
}
</script>

<style>
</style>
