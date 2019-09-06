import Vue from 'vue'
import Vuex, {
  GetterTree,
  ActionTree,
  MutationTree,
  ModuleTree,
  StoreOptions,
  Store
} from 'vuex'
import { alert } from './alert'

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
      alert
    }
  })
  store = Store as Store<RootState>
  return Store
}
