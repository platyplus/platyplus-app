<template lang="pug">
  q-layout(view="lHh Lpr lFf")
    user-header
    user-menu
    q-page-container
      router-view
</template>

<script>
import { loadUser } from '../plugins/auth'
export default {
  name: 'AuthenticatedLayout',
  async preFetch ({ store, currentRoute, previousRoute, redirect, ssrContext }) {
    const user = await loadUser()
    if (!user) {
      if (currentRoute.path === '/') redirect('/public')
      else redirect('/auth/signin')
    } else if (
      !user.preferred_org_unit &&
      !currentRoute.meta.withoutPreferredOrgUnit
    ) {
      // TODO: vraiment utile
      // TODO: nest routes, as this layer won't prefetch again when already loaded
      store.dispatch('navigation/routeRequest', { path: currentRoute.path })
      redirect('/profile/current-org-unit')
    }
  },
  async created () {
    this.$locale = this.user.locale
  },
  async destroy () {
    // TODO: remove the user-related apollo cache
  }
}
</script>

<style>
</style>
