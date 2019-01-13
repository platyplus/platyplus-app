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
    }
    // Router.beforeEach(async (to, from, next) => {
    //   // TODO: use prefetch, but then gather all profile routes to 'children' routes and all
    //   // 'transactionnal' routes in 'children' routes so we can put this piece of code below
    //   // in a shared prefetch method
    //   const user = getUser()
    //   if (user && !user.preferred_org_unit && !to.meta.withoutPreferredOrgUnit) {
    //     store().dispatch('navigation/routeRequest', { path: to.path })
    //     next('/profile/current-org-unit')
    //   } else next()
    // })
  },
  async mounted () {
    this.$locale = this.user.locale
  },
  async destroy () {
    // TODO: remove the user-related apollo cache
  }
}
</script>

<style>
</style>
