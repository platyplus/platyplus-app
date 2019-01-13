<template lang="pug">
  q-page(padding class="justify-center")
    q-field(icon="fas fa-user" label="Login" helper="Enter your user name" error-label="We need a valid user name")
      q-input(v-model="username" ref="username" @keyup.enter="login")
    q-field(icon="fas fa-key" label="Password" helper="Enter your password" error-label="We need a valid password")
      q-input(type="password" v-model="password" @keyup.enter="login")
    q-btn(icon="fas fa-sign-in" label="Sign in" @click="login")
</template>

<style>
</style>

<script>
import { signin } from 'plugins/auth'
export default {
  name: 'PageSignIn',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async login (e) {
      // this.submitted = true TODO: loading button
      const { username, password } = this
      if (username && password) {
        const user = await signin(username, password)
        localStorage.setItem('user', JSON.stringify(user))
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
