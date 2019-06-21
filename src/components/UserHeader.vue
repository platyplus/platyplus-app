<template lang="pug">
  q-header
    q-toolbar(color="primary")
      q-btn(flat dense round @click="toggleDrawer" aria-label="Menu")
        q-icon(name="fas fa-bars")
      q-toolbar-title PlatyPlus
      q-select(
        hide-underline
        emit-value
        map-options
        :options="$locales"
        v-model="$locale")
      q-btn(v-if="authenticated" flat dense round icon="fas fa-sign-out-alt" @click="dialog = true")
      q-dialog(v-model="dialog" persistent)
        q-card
          q-card-section(class="row items-center")
            span(class="q-ml-sm") {{ $t('logout.message') }}
          q-card-actions(align="right")
            q-btn(flat :label="$t('no')" color="primary" v-close-popup)
            q-btn(flat :label="$t('yes')" color="primary" @click="logout")
</template>

<script>
export default {
  name: 'UserHeader',
  data: function () {
    return { dialog: false }
  },
  methods: {
    toggleDrawer () {
      this.$store.dispatch('navigation/toggleDrawer')
    },
    async logout () {
      try {
        await this.$apolloProvider.defaultClient.resetStore()
      } catch (e) {
        // TODO Error: Network error: Cannot read property 'token' of undefined
        //  at new ApolloError (bundle.esm.js:63)
        //  at bundle.esm.js:1155
      }
      this.dialog = false
      this.$router.replace('/public')
    }
  }
}
</script>

<style>
</style>
