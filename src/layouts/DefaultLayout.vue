<template lang="pug">
  q-layout(view="lHh Lpr lFf")
    q-layout-header
      q-toolbar(color="primary" :glossy="$q.theme === 'mat'" :inverted="$q.theme === 'ios'")
        q-btn(flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu")
          q-icon(name="fas fa-bars")
        q-toolbar-title Platyplus
          div(slot="subtitle") TODO: current page
        q-btn(v-if="authenticated" flat dense round icon="fas fa-sign-out-alt" @click="logout")

    q-layout-drawer(v-model="leftDrawerOpen" :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null")
      q-list(no-border link inset-delimiter)
        q-list-header Main
        q-item(to="/" :exact="true")
          q-item-side(icon="fas fa-home")
          q-item-main(label="Home")
        q-item(to="/profile")
          q-item-side(icon="fas fa-user-circle")
          q-item-main(label="Profile")
        q-list-header Configuration
        q-item(to="/org-unit")
          q-item-side(icon="fas fa-sitemap")
          q-item-main(label="Org Units")
        q-item(to="/workflow")
          q-item-side(icon="fas fa-route")
          q-item-main(label="Workflows")
        q-list-header Metadata
        q-item(to="/org-unit-type")
          q-item-side(icon="fas fa-sitemap")
          q-item-main(label="Org Unit Types")
    q-page-container
      router-view
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  methods: {
    async logout (e) {
      try {
        await this.$q.dialog({
          title: 'Signing out', // TODO: internationalisation
          message: 'Are you sure to want to sign out?', // TODO: internationalisation
          // color: 'warning',
          ok: 'Yes', // TODO: internationalisation
          cancel: 'No' // TODO: internationalisation
        })
        this.$store.dispatch('authentication/logout')
      } catch (error) {}
    }
  },
  preFetch ({ store, currentRoute, previousRoute, redirect, ssrContext }) {
    if (!store.getters['authentication/userStatus'].loggedIn) {
      if (currentRoute.path === '/') redirect('/public')
      else redirect('/auth/signin')
    }
  }
}
</script>

<style>
</style>
