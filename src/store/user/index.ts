import { Module } from 'vuex'

import { RootState } from '..'
import { state, UserState } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { getters } from './getters'

export const user: Module<UserState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
