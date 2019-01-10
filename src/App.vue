<template lang="pug">
  div(id="q-app")
    router-view
</template>

<script>
export default {
  name: 'App',
  async preFetch ({ store, currentRoute, previousRoute, redirect, ssrContext }) {
    await store.dispatch('authentication/loadProfile')
  }
}
</script>

<style>
</style>
