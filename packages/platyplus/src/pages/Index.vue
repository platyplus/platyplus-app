<template lang="pug">
q-page(v-if="$authenticated" padding class="justify-center")
  div(v-if="$profile.preferred_org_unit" v-t="{path: 'location.message', args: {location: $profile.preferred_org_unit.name}}")
  q-list(v-if="$profile.org_unit_memberships.length > 1" highlight)
    q-item(to="/profile/current-org-unit" :exact="true")
      q-item-section(avatar icon="fas fa-location-arrow")
      q-item-section(v-t="'location.change'")
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { PageMixin } from 'src/mixins'

@Component
export default class Index extends Mixins(PageMixin) {
  get title() {
    return 'Home' // TODO i18n
  }
}
</script>

<style></style>
