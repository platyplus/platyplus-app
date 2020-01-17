import { state, AlertState } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { Module } from 'vuex'
import { RootState } from '..'

export const alert: Module<AlertState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions
}
