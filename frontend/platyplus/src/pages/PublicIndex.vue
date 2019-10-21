<template lang="pug">
q-page(class="flex flex-center")
  q-btn(to="/public/auth/signin" icon="fas fa-sign-in-alt" label="Sign in")
</template>

<style></style>

<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator'
import { PageMixin } from '../mixins'

@Component
export default class PagePublicIndex extends Mixins(PageMixin) {}
</script>
