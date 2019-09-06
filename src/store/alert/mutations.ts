import { MutationTree } from 'vuex'
import { AlertState } from './state'
export const mutations: MutationTree<AlertState> = {
  success(state, message) {
    state.type = 'alert-success'
    state.message = message
  },
  error(state, message) {
    state.type = 'alert-danger'
    state.message = message
  },
  clear(state) {
    state.type = undefined
    state.message = undefined
  }
}
