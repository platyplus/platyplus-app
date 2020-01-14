/* eslint-disable @typescript-eslint/no-namespace */
import { Mixins } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { mapGetters } from 'vuex'
import { configure, ValidationProvider } from 'vee-validate'
import VueCompositionApi from '@vue/composition-api'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import { ValidationObserver } from 'vee-validate'

import { ErrorsPlugin } from '@platyplus/errors'

import { I18nPlugin } from '../modules/i18n'
import { QuasarPlugin } from '../modules/quasar'
import { AuthenticationPlugin } from '../modules/authentication'
import { ApolloPlugin } from '../modules/apollo'

import { RouterMixin } from '../mixins'
import { QuasarBootOptions } from '../types/quasar'
import messages from '../i18n'
import { getConfig } from '../helpers'
import { MetadataPlugin } from '../modules/metadata'

/*
 * require.context is webpack-related and does not exist in node.
 * However @types/node and @types/webpack-env are conflicting,
 * and lerna makes it difficult to seggregate them (no-hoist)
 * The simplest way is then to ignore the error. */
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
const requireComponent = require.context(
  '../components',
  true, // sub-directories
  /(-?[a-z]*)\.(vue)$/ // any camel-case .vue file
)

export default async ({ Vue, app, store, router }: QuasarBootOptions) => {
  Vue.use(VueCompositionApi)
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

  // TODO uncomment
  // await persistApolloCache(app.apolloProvider.defaultClient.cache)

  // Vue.use(abilitiesPlugin, ability)
  Vue.use(AuthenticationPlugin, { app, store, router })
  Vue.use(MetadataPlugin, { store })
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
  // * Register all components from the ../components directory
  // * See https://vuejs.org/v2/guide/components-registration.html
  // * Ignore the TS error. See the comment on require.context
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  requireComponent.keys().forEach(fileName => {
    const componentConfig = requireComponent(fileName)
    const componentName =
      'H' +
      upperFirst(
        camelCase(
          fileName
            .split('/')
            .pop()
            ?.replace(/\.\w+$/, '')
        )
      )
    Vue.component(componentName, componentConfig.default || componentConfig)
  })

  Vue.component('ValidationObserver', ValidationObserver) // ? Put in a distinct module?
  Vue.component('ValidationProvider', ValidationProvider) // ? Put in a distinct module?
}

declare module 'vue/types/vue' {
  interface Vue {
    $from?: Route
  }
}
