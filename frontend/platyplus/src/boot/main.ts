import { ValidationProvider } from 'vee-validate'
import VueCompositionApi from '@vue/composition-api'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import { ValidationObserver } from 'vee-validate'

import Vue, { VueConstructor } from 'vue'
import VueRouter from 'vue-router'
import { Store } from 'vuex'
import { initAuthentication } from '../modules/authentication'
import { QuasarMetadataPlugin } from '../modules/metadata-quasar'

interface QuasarBootOptions {
  app: Vue
  Vue: VueConstructor
  router: VueRouter
  store: Store<{}>
}

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

export default async ({ Vue, router, store }: QuasarBootOptions) => {
  Vue.use(VueCompositionApi)
  initAuthentication({ store, router })
  Vue.use(QuasarMetadataPlugin, { router, store })
  // ? only load the messages of the desired language?
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

  // TODO put in provideValidation, part of a validation module
  // configure({
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   defaultMessage: (field: string, values: any) => {
  //     // override the field name.
  //     values._field_ = `"${app.i18n.t(field)}"`
  //     return app.i18n.t(`validation.${values._rule_}`, values) as string
  //   }
  // })
  Vue.component('ValidationObserver', ValidationObserver) // ? Put in a distinct module?
  Vue.component('ValidationProvider', ValidationProvider) // ? Put in a distinct module?
}
