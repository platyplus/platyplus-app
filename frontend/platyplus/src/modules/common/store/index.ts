import { Store } from 'vuex'
import { alert } from './alert'
import { navigation } from './navigation'
import { loading } from './loading'

export * from './composables'

export const CommonStorePlugin = (store: Store<{}>) => {
  // TODO upgrade to v2.7.0 and register modules afterwards: https://github.com/robinvdvleuten/vuex-persistedstate/pull/225
  // ? A bit overshooting as only the token really needs to be persisted for now
  //   plugins: [
  //   // createPersistedState({ paths: ['authentication', 'navigation', 'alert'] })
  // ]
  store.registerModule('alert', alert)
  store.registerModule('navigation', navigation)
  store.registerModule('loading', loading)
}
