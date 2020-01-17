import Vuex from 'vuex'

import { alert } from './alert'
import { navigation } from './navigation'
import { loading } from './loading'
import { setStore, getStore, RootState } from './instance'

export * from './composables'
export * from './instance'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */
export const initStore = () => {
  setStore(
    new Vuex.Store<RootState>({
      modules: {
        alert,
        navigation,
        loading
      },
      // ? A bit overshooting as only the token really needs to be persisted for now
      // TODO upgrade to v2.7.0 and register modules afterwards: https://github.com/robinvdvleuten/vuex-persistedstate/pull/225
      plugins: [
        // TODO uncomment
        // createPersistedState({ paths: ['authentication', 'navigation', 'alert'] })
      ]
    })
  )
  return getStore()
}
