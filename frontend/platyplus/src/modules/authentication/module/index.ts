import { Module } from 'vuex'

import { state, UserState } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { getters } from './getters'

export const userModule: Module<UserState, {}> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
