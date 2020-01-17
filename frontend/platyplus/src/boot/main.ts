import { configure, ValidationProvider } from 'vee-validate'
import VueCompositionApi from '@vue/composition-api'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import { ValidationObserver } from 'vee-validate'

import { errorsLink, ErrorsPlugin } from '@platyplus/errors'
import { createClient, dataIdFromObject } from '@platyplus/hasura-apollo-client'

import { I18nPlugin } from '../modules/i18n'
import { QuasarPlugin, QuasarBootOptions } from '../modules/quasar'
import { AuthenticationPlugin } from '../modules/authentication'
import {
  introspectionQueryResultData,
  MetadataPlugin
} from '../modules/metadata'

import messages from '../i18n'
import { getConfig } from '../modules/common'

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

  createClient({
    uri: getConfig().API,
    getToken: () => store.getters['authentication/encodedToken'],
    dataIdFromObject,
    introspectionQueryResultData,
    errorsLink
  })

  // TODO uncomment
  // await persistApolloCache(app.apolloProvider.defaultClient.cache)

  Vue.use(AuthenticationPlugin, { app, store, router })
  Vue.use(MetadataPlugin, { store })
  /**
   * * Loads the user data (profile, table classes, permissions) from Apollo
   * ! Cannot be put in the authentication plugin as Vue.use does not work asynchronously
   */
  if (store.getters['authentication/authenticated'])
    await store.dispatch('onAuthenticated')

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
