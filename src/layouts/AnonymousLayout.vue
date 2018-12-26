<template lang="pug">
  q-layout(view="lHh Lpr lFf")
    q-layout-header
      q-toolbar(color="primary" :glossy="$q.theme === 'mat'" :inverted="$q.theme === 'ios'")
        q-toolbar-title Platyplus
    q-page-container
      router-view
</template>

<script>
export default {
  name: 'AnonymousLayout'
}
</script>

<style>
</style>
