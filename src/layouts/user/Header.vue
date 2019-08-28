<template lang="pug">
q-toolbar(color="primary")
  q-btn(flat dense round @click="toggleDrawer" aria-label="Menu")
    q-icon(name="fas fa-bars")
  q-toolbar-title {{ title }}
  q-select(
    hide-underline
    emit-value
    map-options
    :options="$locales"
    v-model="$locale")
  q-btn(v-if="$authenticated" flat dense round icon="fas fa-sign-out-alt" @click="dialog = true")
  q-dialog(v-model="dialog" persistent)
    q-card
      q-card-section(class="row items-center")
        span(class="q-ml-sm") {{ $t('logout.message') }}
      q-card-actions(align="right")
        q-btn(flat :label="$t('no')" color="primary" v-close-popup)
        q-btn(flat :label="$t('yes')" color="primary" @click="logout")
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { HasuraMixin } from '../../boot/hasura'
@Component
export default class UserHeader extends Mixins(HasuraMixin) {
  dialog = false

  get title() {
    return this.tableName
      ? this.$i18n.t(this.tableName + '.label_plural')
      : 'Platyplus'
  }

  toggleDrawer() {
    this.$store.dispatch('navigation/toggleDrawer')
  }
  async logout() {
    // TODO use the Dialog plugin, not the q-dialog component
    this.$store.dispatch('user/signout')
    this.dialog = false
    this.$router.replace('/public')
  }
}
</script>

<style>
</style>
