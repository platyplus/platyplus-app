import { Module } from 'vuex'

import { actions } from './actions'

export const quasarModule: Module<{}, {}> = {
  namespaced: true,
  actions
}
