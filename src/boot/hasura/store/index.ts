import { state, HasuraState } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { getters } from './getters'
import { Module } from 'vuex'
import { RootState } from 'src/store'

export const hasuraStoreModule: Module<HasuraState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
