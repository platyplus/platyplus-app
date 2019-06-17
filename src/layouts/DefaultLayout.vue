<template lang="pug">
  q-layout(view="lHh Lpr lFf")
    template(v-if="authenticated")
      user-header
      user-menu
    q-header(v-else)
      q-toolbar(color="primary")
        q-toolbar-title Platyplus
    q-page-container
      router-view
</template>

<script>
export default {
  name: 'DefaultLayout',
  async created () {
    // TODO load local once authenticated / first arrival on the site?
    // if (this.user.id) this.$locale = this.user.locale
  },
  async destroy () {
    // TODO: remove the user-related apollo cache
  }
}
</script>

<style>
</style>
