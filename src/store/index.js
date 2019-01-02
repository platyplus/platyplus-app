import Vue from 'vue'
import Vuex from 'vuex'
import authentication from './authentication'
import alert from './alert'
import navigation from './navigation'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      alert,
      authentication,
      navigation
    }
  })

  return Store
}
