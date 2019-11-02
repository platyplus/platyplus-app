import _Vue from 'vue'
import { Store } from 'vuex'
import { quasarModule } from './module'
import { QVueGlobals } from 'quasar'

export interface QuasarOptions {
  store: Store<{}>
}

export function QuasarPlugin(Vue: typeof _Vue, options: QuasarOptions) {
  const { store } = options
  store.registerModule('quasar', quasarModule)
}

declare module 'vue/types/vue' {
  interface Vue {
    $q: QVueGlobals
  }
}
