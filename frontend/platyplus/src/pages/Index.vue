<template lang="pug">
q-page(v-if="authenticated" padding class="justify-center")
  div(v-if="profile.preferred_org_unit") {{ translate('location.message', {location: profile.preferred_org_unit.name }) }}
  q-list(v-if="profile.org_unit_memberships.length > 1" highlight)
    q-item(to="/profile/current-org-unit" :exact="true")
      q-item-section(avatar icon="fas fa-location-arrow")
      q-item-section {{ translate('location.change')}}
</template>

<script lang="ts">
// TODO remove the v-t, or 'api-compose' them
import { createComponent } from '@vue/composition-api'
import { setTitle } from '../modules/common'
import { useTranslator } from '../modules/i18n'
import { useProfile, useAuthenticated } from '../modules/authentication'
export default createComponent({
  setup() {
    setTitle('index.title')
    const profile = useProfile()
    const translate = useTranslator()
    const authenticated = useAuthenticated()
    return { profile, authenticated, translate }
  }
})
</script>

<style></style>
