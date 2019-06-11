<template lang="pug">
  q-layout(view="lHh Lpr lFf")
    template(v-if="authenticated")
      user-header
      user-menu
    q-layout-header(v-else)
      q-toolbar(color="primary" :glossy="$q.theme === 'mat'" :inverted="$q.theme === 'ios'")
        q-toolbar-title Platyplus
    q-page-container
      router-view
</template>

<script>
export default {
  name: 'DefaultLayout',
  async created () {
    // TODO load local once authenticated / first arrival on the site?
    if (this.user) this.$locale = this.user.locale
  },
  async destroy () {
    // TODO: remove the user-related apollo cache
  }
}
</script>

<style>
</style>
