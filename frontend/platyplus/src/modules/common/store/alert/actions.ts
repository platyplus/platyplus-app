import { ActionTree } from 'vuex'
import { AlertState } from './state'
import { RootState } from '..'

export const actions: ActionTree<AlertState, RootState> = {
  success: ({ commit }, message) => {
    commit('success', message)
  },
  error: ({ commit }, message) => {
    commit('error', message)
  },
  clear: ({ commit }, message) => {
    commit('success', message)
  }
}
