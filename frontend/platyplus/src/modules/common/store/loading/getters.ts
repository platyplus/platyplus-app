import { GetterTree } from 'vuex'

import { LoaderState } from './state'

export const getters: GetterTree<LoaderState, {}> = {
  loading(state) {
    for (const value of state.progress.values()) {
      if (value.progress < value.target) return true
    }
    return state.loading
  },
  message(state) {
    for (const value of state.progress.values()) {
      if (value.message) return value.message
    }
    return state.message
  }
}
