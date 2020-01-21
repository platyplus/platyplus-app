import _Vue from 'vue'
import VueRouter from 'vue-router'
import { Store } from 'vuex'
import { upperFirst, camelCase } from 'lodash'
import { MetadataPlugin } from '../metadata'
import { LayoutOptions, createRoutes } from './routes'
import { ApolloClient } from '@platyplus/hasura-apollo-client'
export * from './routes'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DefaultApolloClient = ApolloClient<any>
// TODO rename the metadata-quasar module into data-quasar
interface PluginOptions {
  store: Store<{}>
  router: VueRouter
  apolloClient: DefaultApolloClient
}
type MetadataQuasarPluginOptions = PluginOptions & LayoutOptions

/*
 * require.context is webpack-related and does not exist in node.
 * However @types/node and @types/webpack-env are conflicting,
 * and lerna makes it difficult to seggregate them (no-hoist)
 * The simplest way is then to ignore the error. */
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
const requireComponent = require.context(
  './components',
  true, // sub-directories
  /(-?[a-z]*)\.(vue)$/ // any camel-case .vue file
)

export function QuasarMetadataPlugin(
  Vue: typeof _Vue,
  options: MetadataQuasarPluginOptions
) {
  const { store, router, apolloClient, ...layoutOptions } = options
  Vue.use(MetadataPlugin, { store, apolloClient })
  store.subscribeAction(action => {
    if (action.type === 'loadRoutes')
      router.addRoutes(createRoutes(layoutOptions))
  })
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
}
