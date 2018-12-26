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
export default {
  name: 'PageSignIn',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login (e) {
      // this.submitted = true TODO: loading button
      const { username, password } = this
      if (username && password) {
        this.$store.dispatch('authentication/login', { username, password })
      }
    }
  },
  mounted () {
    this.$nextTick(() => this.$refs.username.focus())
  }
}
</script>
