import { state, UserState } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { getters } from './getters'
import { Module } from 'vuex'
import { RootState } from 'src/store'

export { ability } from './ability'

export const userModule: Module<UserState, RootState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
