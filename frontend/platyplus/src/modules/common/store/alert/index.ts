import { state, AlertState } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { Module } from 'vuex'

export const alert: Module<AlertState, {}> = {
  namespaced: true,
  state,
  mutations,
  actions
}
