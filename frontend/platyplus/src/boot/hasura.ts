import { abilitiesPlugin } from '@casl/vue'
import { Mixins } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { mapGetters } from 'vuex'
import { configure } from 'vee-validate'

import { persistApolloCache } from '@platyplus/vuex-apollo-offline'
import { ErrorsPlugin } from '@platyplus/errors'

import { ability } from '../modules/authorization'
import { I18nPlugin } from '../modules/i18n'
import { QuasarPlugin } from '../modules/quasar'
import { AuthenticationPlugin } from '../modules/authentication'
import { ApolloPlugin } from '../modules/apollo'

import { RouterMixin } from '../mixins'
import { QuasarBootOptions } from '../types/quasar'
import MenuItem from '../components/MenuItem.vue'
import messages from '../i18n'
import { getConfig } from '../helpers'

export default async ({ Vue, app, store, router }: QuasarBootOptions) => {
  Vue.use(QuasarPlugin, { store })
  // ? only load the messages of the desired language?
  Vue.use(I18nPlugin, { app, store, messages })

  configure({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultMessage: (field: string, values: any) => {
      // override the field name.
      values._field_ = `"${app.i18n.t(field)}"`
      return app.i18n.t(`validation.${values._rule_}`, values) as string
    }
  })

  Vue.use(ErrorsPlugin, store, { i18n: app.i18n })

  Vue.use(ApolloPlugin, {
    app,
    getToken: () => store.getters['authentication/encodedToken'],
    uri: getConfig().API
  })

  await persistApolloCache(app.apolloProvider.defaultClient.cache)

  Vue.use(abilitiesPlugin, ability)
  Vue.use(AuthenticationPlugin, { app, store, router })

  /**
   * * Loads the user data (profile, table classes, permissions) from Apollo
   * ! Cannot be put in the authentication plugin as Vue.use does not work asynchronously
   */
  if (store.getters['authentication/authenticated'])
    await store.dispatch('onAuthenticated')

  Vue.mixin({
    computed: {
      ...mapGetters({
        $title: 'navigation/title'
      })
    }
  })

  Vue.mixin(Mixins(RouterMixin))

  Vue.component('p-menu-item', MenuItem)
}

declare module 'vue/types/vue' {
  interface Vue {
    $from?: Route
  }
}
