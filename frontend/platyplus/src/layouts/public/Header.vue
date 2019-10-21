<template lang="pug">
q-toolbar(color="primary")
  q-toolbar-title {{ $title }}
//-   q-btn(flat dense round @click="toggleDrawer" aria-label="Menu")
//-     q-icon(name="fas fa-bars")
    
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class PublicHeader extends Vue {}
</script>

<style></style>
