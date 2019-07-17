<template lang="pug">
  q-page(padding class="justify-center")
    q-input(icon="fas fa-user" label="Login" helper="Enter your user name" error-label="We need a valid user name" v-model="username" ref="username" @keyup.enter="login")
    q-input(icon="fas fa-key" label="Password" helper="Enter your password" error-label="We need a valid password" type="password" v-model="password" @keyup.enter="login")
    q-btn(icon="fas fa-sign-in-alt" label="Sign in" @click="login")
</template>

<style>
</style>

<script>
import { signin } from 'boot/auth'
export default {
  name: 'PageSignIn',
  data: () => ({
    username: '',
    password: ''
  }),
  methods: {
    async login (e) {
      // this.submitted = true TODO: loading button
      const { username, password } = this
      if (username && password) {
        await signin(username, password)
        await this.$store.dispatch(
          'navigation/route',
          { path: '/' },
          { root: true }
        )
      }
    }
  },
  mounted () {
    this.$nextTick(() => this.$refs.username.focus())
  }
}
</script>
