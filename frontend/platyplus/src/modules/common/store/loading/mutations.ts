import { MutationTree } from 'vuex'
import { LoaderState } from './state'
export const mutations: MutationTree<LoaderState> = {
  start(state, message?: string) {
    state.loading = true
    state.message = message
  },

  stopAll(state) {
    state.progress.clear()
    state.loading = false
    state.message = undefined
  },

  startProgress(state, { key, target, message }) {
    state.progress.set(key, { target, progress: 0, message })
    state.loading = true
  },

  incrementProgress(state, key) {
    const loadingProgress = state.progress.get(key)
    if (loadingProgress) loadingProgress.progress++
  },

  stopProgress(state, key) {
    state.progress.delete(key)
  }
}
