import { Store } from 'vuex'
import { quasarModule } from './store'
import { QVueGlobals } from 'quasar'
import { inject, provide } from '@vue/composition-api'

declare module 'vue/types/vue' {
  interface Vue {
    $q: QVueGlobals
  }
}

const QuasarSymbol = Symbol()

export function provideQuasar(store: Store<{}>, quasar: QVueGlobals) {
  store.registerModule('quasar', quasarModule)
  provide(QuasarSymbol, quasar)
}

export function useQuasar() {
  const quasar = inject(QuasarSymbol)
  if (!quasar) {
    // throw error, no store provided
  }
  return quasar as QVueGlobals
}
