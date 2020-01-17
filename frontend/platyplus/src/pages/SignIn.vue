<template lang="pug">
q-page(padding class="justify-center")
  validation-observer(slim ref="validator")
    q-form(autofocus @keyup.enter="login")
      validation-provider(name="authentication.labels.username" vid="username" v-slot="provider" rules="required" slim)
        q-input(v-model="form.username" autocomplete="username" type="text"
          :label="translate('authentication.labels.username')" :hint="translate('authentication.helpers.username')"
          :error-message="errorMessage(provider)" :error="error(provider)")
      validation-provider(name="authentication.labels.password" vid="password" v-slot="provider" rules="required" slim)
        q-input(v-model="form.password" autocomplete="current-password" type="password"
          :label="translate('authentication.labels.password')" :hint="translate('authentication.helpers.password')"
          :error-message="errorMessage(provider)" :error="error(provider)")
      q-btn(icon="fas fa-sign-in-alt" :label="translate('login.button')" @click="login" :loading="loading")
</template>

<script lang="ts">
import { createComponent, reactive } from '@vue/composition-api'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import { required } from 'vee-validate/dist/rules'

import { setTitle } from '../composables/navigation'
import { useTranslator } from '../modules/i18n'
import { error, errorMessage, getObserver } from '../composables/validation'
import { useLoading } from '../composables/loading'
import { useStore } from '../modules/common'

// Install required rule and message.
extend('required', required)

export default createComponent({
  components: {
    ValidationProvider,
    ValidationObserver
  },
  setup(props, context) {
    setTitle('authentication.title')
    const translate = useTranslator()
    const form = reactive({ username: '', password: '' })
    const store = useStore()
    // TODO move the login action into the authentication composable
    const login = async () => {
      const observer = getObserver(context)
      if (await observer.validate()) {
        await store.dispatch('authentication/signin', form)
        // TODO inject/provide
        if (!context.root.$error) {
          await store.dispatch(
            'navigation/route',
            { path: '/' },
            { root: true }
          )
        } else {
          observer.setErrors(context.root.$fieldErrors('authentication')) // TODO inject/provide
        }
      }
    }
    return {
      error,
      errorMessage,
      loading: useLoading(),
      login,
      form,
      translate
    }
  }
})
</script>

<style></style>
