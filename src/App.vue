<template lang="pug">
  div(id="q-app")
    router-view
</template>

<script>
export default {
  name: 'App',
  async preFetch ({
    store,
    currentRoute,
    previousRoute,
    redirect,
    ssrContext
  }) {}
}
</script>

<style>
</style>
