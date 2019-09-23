<template lang="pug">
  q-page(padding class="justify-center")
    router-view
</template>

<style></style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class PageOrgUnit extends Vue {}
</script>
