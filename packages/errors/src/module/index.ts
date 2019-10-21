import { Module } from 'vuex'

import { state, ErrorsState } from './state'
import { mutations } from './mutations'
import { getters } from './getters'

export const errors: Module<ErrorsState, {}> = {
  namespaced: true,
  state,
  getters,
  mutations
}
