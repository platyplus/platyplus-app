<template lang="pug">
  q-layout-header
      q-toolbar(color="primary" :glossy="$q.theme === 'mat'" :inverted="$q.theme === 'ios'")
        q-btn(flat dense round @click="toggleDrawer" aria-label="Menu")
          q-icon(name="fas fa-bars")
        q-toolbar-title Platyplus
          div(slot="subtitle") TODO: current page
        q-btn(v-if="authenticated" flat dense round icon="fas fa-sign-out-alt" @click="logout")
</template>

<script>
export default {
  name: 'UserHeader',
  methods: {
    toggleDrawer () {
      this.$store.dispatch('navigation/toggleDrawer')
    },
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
  }
}
</script>

<style>
</style>
