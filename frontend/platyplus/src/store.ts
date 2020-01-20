import Vue from 'vue'
import Vuex, { Store } from 'vuex'
Vue.use(Vuex)

let _store: Store<{}>
export const getStore = () => _store

export default function(/* { ssrContext } */) {
  _store = new Store<{}>({
    modules: {}
  })
  return _store
}
