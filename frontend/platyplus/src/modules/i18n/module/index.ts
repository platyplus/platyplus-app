import { Module } from 'vuex'

import { state, I18nState } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { getters } from './getters'

export const i18nModule: Module<I18nState, {}> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
