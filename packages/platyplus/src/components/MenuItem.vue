<template lang="pug">
  q-item(clickable :to="to" :exact="true")
    q-item-section(avatar)
      q-icon(:name="'fas fa-'+icon")
    q-item-section
      slot
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
@Component
export default class MenuItem extends Vue {
  @Prop(String) readonly icon?: string
  @Prop(String) readonly to?: string
}
</script>

<style></style>
