import { state, LoaderState } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { Module } from 'vuex'
import { getters } from './getters'
export const loading: Module<LoaderState, {}> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
