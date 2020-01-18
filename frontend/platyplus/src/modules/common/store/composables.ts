import { provide, inject } from '@vue/composition-api'
import { Store } from 'vuex'

import { getStore, RootState } from './instance'

const StoreSymbol = Symbol()

export function provideStore() {
  const store = getStore()
  provide(StoreSymbol, store)
  return store
}

export function useStore() {
  const store = inject(StoreSymbol)
  if (!store) {
    // throw error, no store provided
  }
  return store as Store<RootState>
}
