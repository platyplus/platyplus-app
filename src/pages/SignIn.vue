<template lang="pug">
q-page(padding class="justify-center")
  q-form(autofocus)
    p-input(v-model="username" form="user" name="username" :enter="login" autocomplete="username")
    p-input(v-model="password" form="user" name="password" :enter="login" autocomplete="current-password")
  q-btn(icon="fas fa-sign-in-alt" label="Sign in" @click="login")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component
export default class PageSignIn extends Vue {
  username = ''
  password = ''
  async login() {
    // this.submitted = true // TODO: loading button
    const { username, password } = this
    if (username && password) {
      await this.$store.dispatch('user/signin', { username, password })
      await this.$store.dispatch(
        'navigation/route',
        { path: '/' },
        { root: true }
      )
    }
  }
}
</script>

<style>
</style>
