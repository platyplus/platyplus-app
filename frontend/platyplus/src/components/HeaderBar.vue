<template lang="pug">
q-toolbar(color="primary")
    slot(name="left")
    q-toolbar-title {{ $title.translate ? $t($title.label) : $title.label }}
    q-select(
      hide-underline
      emit-value
      map-options
      :options="$locales"
      v-model="$locale")
    slot(name="right")  
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class HeaderBar extends Vue {}
</script>

<style></style>
