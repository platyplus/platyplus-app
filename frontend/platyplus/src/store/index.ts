import Vue from 'vue'
import Vuex, {
  GetterTree,
  ActionTree,
  MutationTree,
  ModuleTree,
  Store
} from 'vuex'

import { alert } from './alert'
import { navigation } from './navigation'
import { loading } from './loading'
import VueCompositionApi, { provide, inject } from '@vue/composition-api'

Vue.use(Vuex)
Vue.use(VueCompositionApi)

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
  store = new Vuex.Store<RootState>({
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

  return store
}

const StoreSymbol = Symbol()

export function provideStore() {
  provide(StoreSymbol, store)
}

export function useStore() {
  const store = inject(StoreSymbol)
  if (!store) {
    // throw error, no store provided
  }
  return store as Store<RootState>
}
