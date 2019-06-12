<template lang="pug">
  q-layout-header
      q-toolbar(color="primary" :glossy="$q.theme === 'mat'" :inverted="$q.theme === 'ios'")
        q-btn(flat dense round @click="toggleDrawer" aria-label="Menu")
          q-icon(name="fas fa-bars")
        q-toolbar-title PlatyPlus
          div(slot="subtitle") TODO: CURRENT PAGE...
        q-select(
          hide-underline
          :options="$locales"
          v-model="$locale")
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
          title: this.$t('logout.title'),
          message: this.$t('logout.message'),
          // color: 'warning',
          ok: this.$t('yes'),
          cancel: this.$t('no')
        })
        // TODO: workaround to WriteToStore: Missing field token in {}
        // this.$apolloProvider.defaultClient.resetStore()
        // Try to stop using token.id -> token.userId instead
        this.$apolloProvider.defaultClient.cache.writeData({
          data: {
            __typename: 'token',
            id: null,
            decoded: null
          }
        })
        this.$router.replace('/public')
      } catch (error) {}
    }
  }
}
</script>

<style>
</style>
