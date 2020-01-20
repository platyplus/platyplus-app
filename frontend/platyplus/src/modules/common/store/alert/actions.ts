import { ActionTree } from 'vuex'
import { AlertState } from './state'

export const actions: ActionTree<AlertState, {}> = {
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
