<template lang="pug">
q-layout(view="lHh Lpr lFf")
  q-header
    router-view(name="header")
  router-view(name="menu")
  q-page-container
    router-view
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component
export default class UserLayout extends Vue {}
</script>

<style></style>
