<template lang="pug">
  q-layout(view="lHh Lpr lFf")
    user-header
    user-menu
    q-page-container
      router-view
</template>

<script>
export default {
  name: 'DefaultLayout',
  preFetch ({ store, currentRoute, previousRoute, redirect, ssrContext }) {
    if (!store.getters['authentication/userStatus'].loggedIn) {
      if (currentRoute.path === '/') redirect('/public')
      else redirect('/auth/signin')
    }
  }
}
</script>

<style>
</style>
