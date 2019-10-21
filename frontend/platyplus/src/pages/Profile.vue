<template lang="pug">
q-page(v-if="$authenticated" padding class="justify-center")
  div Profile page.
</template>

<style></style>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { PageMixin } from '../mixins'

@Component
export default class Profile extends Mixins(PageMixin) {
  readonly title = 'user.profile.title'
}
</script>
