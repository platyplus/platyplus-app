import { QuasarBootOptions } from 'src/types/quasar'
import { hasuraStoreModule } from './store'
import { QVueGlobals } from 'quasar'
export * from './schema'
export * from './mixins'
export * from './graphql'

export default ({ store }: QuasarBootOptions) => {
  store.registerModule('hasura', hasuraStoreModule)
}

declare module 'vue/types/vue' {
  interface Vue {
    $q: QVueGlobals
  }
}
