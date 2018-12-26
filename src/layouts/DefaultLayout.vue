<template lang="pug">
  q-layout(view="lHh Lpr lFf")
    q-layout-header
      q-toolbar(color="primary" :glossy="$q.theme === 'mat'" :inverted="$q.theme === 'ios'")
        q-btn(flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu")
          q-icon(name="fas fa-bars")
        q-toolbar-title Platyplus
          div(slot="subtitle") Running on Quasar v{{ $q.version }}
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
    logout (e) {
      this.$store.dispatch('authentication/logout')
    }
  }
}
</script>

<style>
</style>
