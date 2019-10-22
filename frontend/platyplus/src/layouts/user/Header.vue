<template lang="pug">
header-bar
  template(v-slot:left)
    q-btn(flat dense round @click="toggleDrawer" aria-label="Menu")
      q-icon(name="fas fa-bars")
  template(v-slot:right)
    q-btn(v-if="$authenticated" flat dense round icon="fas fa-sign-out-alt" @click="logout")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import HeaderBar from '../../components/HeaderBar.vue'

@Component({ components: { HeaderBar } })
export default class UserHeader extends Vue {
  toggleDrawer() {
    this.$store.dispatch('navigation/toggleDrawer')
  }
  async logout() {
    this.$q
      .dialog({
        message: this.$t('logout.message') as string,
        cancel: true,
        persistent: true
      })
      .onOk(() => {
        this.$store.dispatch('signout')
        this.$router.replace('/public')
      })
  }
}
</script>

<style></style>
