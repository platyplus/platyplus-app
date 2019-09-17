<template lang="pug">
q-page(class="flex flex-center")
  q-btn(to="/public/auth/signin" icon="fas fa-sign-in-alt" label="Sign in")
</template>

<style>
</style>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component
export default class PagePublicIndex extends Vue {}
</script>
