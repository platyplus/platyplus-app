<template lang="pug">
h-header-bar
  template(v-slot:left)
    q-btn(flat dense round @click="toggleDrawer" aria-label="Menu")
      q-icon(name="fas fa-bars")
  template(v-slot:right)
    q-btn(v-if="authenticated" flat dense round icon="fas fa-sign-out-alt" @click="logout")
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'

import { useToggleDrawer } from '../../modules/common'
import { useLogout, useAuthenticated } from '../../modules/authentication'

export default createComponent({
  setup() {
    return {
      toggleDrawer: useToggleDrawer(),
      logout: useLogout(),
      authenticated: useAuthenticated()
    }
  }
})
</script>

<style></style>
