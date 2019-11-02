import { Module } from 'vuex'

import { state, QuasarState } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { getters } from './getters'

export const quasarModule: Module<QuasarState, {}> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
