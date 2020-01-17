import Vue from 'vue'
import Vuex from 'vuex'
import { initStore } from './modules/common'

Vue.use(Vuex)

export default function(/* { ssrContext } */) {
  return initStore()
}
