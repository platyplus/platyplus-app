import { Module } from 'vuex'

import { state, MetadataState } from './state'
import { mutations } from './mutations'
import { actions } from './actions'
import { getters } from './getters'

export const metadataModule: Module<MetadataState, {}> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
