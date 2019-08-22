import { state, NavigationState } from './state'
import { getters } from './getters'
import { mutations } from './mutations'
import { actions } from './actions'
import { Module } from 'vuex'
import { RootState } from 'src/store'

export const navigationModule: Module<NavigationState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
