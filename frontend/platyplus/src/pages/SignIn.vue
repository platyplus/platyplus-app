<template lang="pug">
q-page(padding class="justify-center")
  q-form(autofocus @keyup.enter="login")
    validation-observer(slim ref="validator" v-slot="{ invalid }")
      validation-provider(name="user.labels.username" v-slot="{ errors, invalid, touched, validated }" rules="required" slim)
        q-input(v-model="username" autocomplete="username" type="text"
          :label="$t('user.labels.username')" :hint="$t('user.helpers.username')"
          :error-message="errors[0]" :error="(touched || validated) && invalid")
      validation-provider(name="user.labels.password" v-slot="{ errors, invalid, touched, validated }" rules="required" slim)
        q-input(v-model="password" autocomplete="current-password" type="password"
          :label="$t('user.labels.password')" :hint="$t('user.helpers.password')"
          :error-message="errors[0]" :error="(touched || validated) && invalid")
      q-btn(icon="fas fa-sign-in-alt" :label="$t('login.button')" @click="login" :disable="invalid")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import { required } from 'vee-validate/dist/rules'

// Install required rule and message.
extend('required', required)

@Component({
  components: {
    ValidationProvider,
    ValidationObserver
  }
})
export default class PageSignIn extends Vue {
  username = ''
  password = ''
  async login() {
    console.log(this.$refs.validator)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (await (this.$refs.validator as any).validate()) {
      const { username, password } = this
      // this.submitted = true // TODO: loading button
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

<style></style>
