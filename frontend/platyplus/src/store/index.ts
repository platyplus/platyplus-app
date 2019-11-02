import Vue from 'vue'
import Vuex, {
  GetterTree,
  ActionTree,
  MutationTree,
  ModuleTree,
  StoreOptions,
  Store
} from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import { alert } from './alert'
import { hasura } from './hasura'
import { navigation } from './navigation'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RootState {}

export interface Module<S, R> {
  namespaced?: boolean
  state?: S | (() => S)
  getters?: GetterTree<S, R>
  actions?: ActionTree<S, R>
  mutations?: MutationTree<S>
  modules?: ModuleTree<R>
}

export let store: Store<RootState>

export default function(/* { ssrContext } */) {
  const Store: StoreOptions<RootState> = new Vuex.Store<RootState>({
    modules: {
      alert,
      hasura,
      navigation
    },
    // ? A bit overshooting as only the token really needs to be persisted for now
    // TODO upgrade to v2.7.0 and register modules afterwards: https://github.com/robinvdvleuten/vuex-persistedstate/pull/225
    plugins: [
      createPersistedState({ paths: ['authentication', 'navigation', 'alert'] })
    ]
  })
  store = Store as Store<RootState>
  return Store
}
