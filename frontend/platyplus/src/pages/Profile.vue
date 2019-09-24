<template lang="pug">
q-page(v-if="$authenticated" padding class="justify-center")
  div Profile page
</template>

<style></style>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { PageMixin } from 'src/mixins'

@Component
export default class Profile extends Mixins(PageMixin) {}
</script>
