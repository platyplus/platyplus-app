import _Vue from 'vue'
import { Store } from 'vuex'
import { quasarModule } from './store'
import { QVueGlobals } from 'quasar'
import { inject, provide } from '@vue/composition-api'
export * from './types'

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

const QuasarSymbol = Symbol()

export function provideQuasar(quasar: QVueGlobals) {
  provide(QuasarSymbol, quasar)
}

export function useQuasar() {
  const quasar = inject(QuasarSymbol)
  if (!quasar) {
    // throw error, no store provided
  }
  return quasar as QVueGlobals
}
