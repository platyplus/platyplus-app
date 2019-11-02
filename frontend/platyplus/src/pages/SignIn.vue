<template lang="pug">
q-page(padding class="justify-center")
  validation-observer(slim ref="validator")
    q-form(autofocus @keyup.enter="login")
      validation-provider(name="authentication.labels.username" vid="username" v-slot="provider" rules="required" slim)
        q-input(v-model="username" autocomplete="username" type="text"
          :label="$t('authentication.labels.username')" :hint="$t('authentication.helpers.username')"
          :error-message="errorMessage(provider)" :error="error(provider)")
      validation-provider(name="authentication.labels.password" vid="password" v-slot="provider" rules="required" slim)
        q-input(v-model="password" autocomplete="current-password" type="password"
          :label="$t('authentication.labels.password')" :hint="$t('authentication.helpers.password')"
          :error-message="errorMessage(provider)" :error="error(provider)")
      q-btn(icon="fas fa-sign-in-alt" :label="$t('login.button')" @click="login")
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import { required } from 'vee-validate/dist/rules'
import { PageMixin } from '../mixins'
import { GenericObject } from '../types/common'

interface VeeValidator {
  invalid: boolean
  touched: boolean
  validated: boolean
  errors?: string[]
}

interface VeeObserver {
  validate: () => boolean
  setErrors: (errors: GenericObject) => void
}

// Install required rule and message.
extend('required', required)

@Component({
  components: {
    ValidationProvider,
    ValidationObserver
  }
})
export default class PageSignIn extends Mixins(PageMixin) {
  readonly title = 'authentication.title'

  username = ''
  password = ''
  error({ invalid, touched, validated }: VeeValidator) {
    return (touched || validated) && invalid
  }
  errorMessage({ errors }: VeeValidator) {
    if (!!errors && errors.length) {
      return errors[0]
    }
  }
  async login() {
    const observer = (this.$refs.validator as unknown) as VeeObserver
    if (await observer.validate()) {
      const { username, password } = this
      // this.submitted = true // TODO: loading button
      await this.$store.dispatch('authentication/signin', {
        username,
        password
      })
      if (!this.$error) {
        if (this.$profile.locale) {
          this.$locale = this.$profile.locale
        }
        await this.$store.dispatch(
          'navigation/route',
          { path: '/' },
          { root: true }
        )
      } else {
        observer.setErrors(this.$fieldErrors('authentication'))
      }
    }
  }
}
</script>

<style></style>
