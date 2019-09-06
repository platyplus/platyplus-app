import { Module } from 'vuex'

import { RootState } from '..'
import { actions } from './actions'
import { getters } from './getters'
import { mutations } from './mutations'
import { state, HasuraState } from './state'

export const hasura: Module<HasuraState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
