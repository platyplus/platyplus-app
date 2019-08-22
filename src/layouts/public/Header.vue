<template lang="pug">
q-toolbar(color="primary")
  q-toolbar-title {{ translatedTitle }}
//-   q-btn(flat dense round @click="toggleDrawer" aria-label="Menu")
//-     q-icon(name="fas fa-bars")
    
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component
export default class PublicHeader extends Vue {
  @Prop({ type: String, default: '' }) title?: string // * should receive the i18n translation path of the title
  get translatedTitle() {
    // TODO i18n according to the above comment
    return this.title || 'Platyplus!'
  }
}
</script>

<style>
</style>
