import { Module } from 'vuex'

import { actions } from './actions'

export const metadataModule: Module<{}, {}> = {
  namespaced: true,
  actions
}
