import 'reflect-metadata'
import _Vue from 'vue'
import { Store, mapGetters } from 'vuex'
import { onError } from 'apollo-link-error'
import { plainToClass } from 'class-transformer'
import { get } from 'object-path'
import { errors } from './module'
import { InputError } from './classes'

export { InputError }
// TODO rename the package to vuex-errors
export interface ErrorsPluginOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  i18n?: any
}
let store: Store<{}>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export let i18n: any

export function ErrorsPlugin(
  Vue: typeof _Vue,
  vuexStore: Store<{}>,
  options: ErrorsPluginOptions = {}
): void {
  store = vuexStore
  store.registerModule(['errors'], errors)
  i18n = options.i18n
  Vue.mixin({
    computed: mapGetters({
      $error: 'errors/error',
      $fieldErrors: 'errors/fieldErrors'
    })
  })
}

export const errorsLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(error => {
      if (get(error, 'extensions.exception.table'))
        store.commit('errors/add', plainToClass(InputError, graphQLErrors))
      else console.log(error) // TODO other errors such as the Hasura ones
    })

  if (networkError) console.log(`[Network error]: ${networkError}`) // TODO
})

declare module 'vue/types/vue' {
  interface Vue {
    $error: boolean
    $fieldErrors: (path: string) => Record<string, string[]>
  }
}
