<template lang="pug">
header-bar
  template(v-slot:left)
    q-btn(flat dense round @click="toggleDrawer" aria-label="Menu")
      q-icon(name="fas fa-bars")
  template(v-slot:right)
    q-btn(v-if="authenticated" flat dense round icon="fas fa-sign-out-alt" @click="logout")
</template>

<script lang="ts">
import { createComponent } from '@vue/composition-api'

import HeaderBar from '../../components/HeaderBar.vue'
import { useToggleDrawer } from '../../composables/navigation'
import { useLogout, useAuthenticated } from '../../composables/authentication'

export default createComponent({
  name: 'UserHeader',
  components: { HeaderBar },
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
