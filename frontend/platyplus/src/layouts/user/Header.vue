<template lang="pug">
q-toolbar(color="primary")
  q-btn(flat dense round @click="toggleDrawer" aria-label="Menu")
    q-icon(name="fas fa-bars")
  q-toolbar-title {{ $title }}
  q-select(
    hide-underline
    emit-value
    map-options
    :options="$locales"
    v-model="$locale")
  q-btn(v-if="$authenticated" flat dense round icon="fas fa-sign-out-alt" @click="logout")
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { HasuraMixin } from '../../mixins'
@Component
export default class UserHeader extends Mixins(HasuraMixin) {
  // get title(): string {
  //   return this.tableName || 'title'
  // }

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
        this.$store.dispatch('user/signout')
        this.$router.replace('/public')
      })
  }
}
</script>

<style></style>
