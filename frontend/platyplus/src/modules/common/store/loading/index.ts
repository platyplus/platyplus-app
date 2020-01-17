import { state, LoaderState } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { Module } from 'vuex'
import { RootState } from '..'
import { getters } from './getters'
export const loading: Module<LoaderState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
