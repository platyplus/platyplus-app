import { ActionTree } from 'vuex'
import { LoaderState } from './state'
import { Loading, LoadingBar } from 'quasar'

export const actions: ActionTree<LoaderState, {}> = {
  start: ({ commit }, message?: string) => {
    commit('start', message)
    Loading.show({ message })
  },

  stop: ({ commit }) => {
    commit('stopAll')
    Loading.hide()
    LoadingBar.stop()
  },

  startProgress: ({ commit, getters }, { key, target = 0, message }) => {
    commit('startProgress', { key, target, message })
    Loading.show({ message: getters['message'] })
    LoadingBar.start(target === 0 ? 300 : 0)
  },

  incrementProgress: ({ commit, state }, key) => {
    commit('incrementProgress', key)
    let totalTarget = 0
    for (const value of state.progress.values()) {
      totalTarget += value.target
    }
    LoadingBar.increment(100.0 / totalTarget)
  },

  stopProgress: ({ commit, state }, key) => {
    commit('stopProgress', key)
    if (state.progress.size === 0) {
      LoadingBar.stop()
    }
  }
}
