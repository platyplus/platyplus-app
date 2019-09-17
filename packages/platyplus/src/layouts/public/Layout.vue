<template lang="pug">
q-layout(view="lHh Lpr lFf")
  q-header
    router-view(name="header")
  q-page-container
    router-view
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component
export default class PublicLayout extends Vue {}
</script>

<style>
</style>
