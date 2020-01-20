import { Module } from 'vuex'

import { actions } from './actions'
import { getters } from './getters'
import { mutations } from './mutations'
import { state, NavigationState } from './state'

export const navigation: Module<NavigationState, {}> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
