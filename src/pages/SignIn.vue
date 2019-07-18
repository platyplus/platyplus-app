<template lang="pug">
  q-page(padding class="justify-center")
    p-input(v-model="username" form="user" name="username"
      ref="username"
      :enter="login")
    p-input(v-model="password" form="user" name="password"
      :enter="login")
    q-btn(icon="fas fa-sign-in-alt" label="Sign in" @click="login")
</template>

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

<style>
</style>
