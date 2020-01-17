import { Module } from 'vuex'

import { RootState } from '..'
import { actions } from './actions'
import { getters } from './getters'
import { mutations } from './mutations'
import { state, NavigationState } from './state'

export const navigation: Module<NavigationState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
