import { GetterTree, ActionTree, MutationTree, ModuleTree, Store } from 'vuex'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RootState {}
let store: Store<RootState>

export interface Module<S, R> {
  namespaced?: boolean
  state?: S | (() => S)
  getters?: GetterTree<S, R>
  actions?: ActionTree<S, R>
  mutations?: MutationTree<S>
  modules?: ModuleTree<R>
}

export const setStore = (value: Store<RootState>) => (store = value)
export const getStore = () => store
