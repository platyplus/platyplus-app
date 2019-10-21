import { MutationTree } from 'vuex'

import { ErrorsState } from './state'
import { GenericError } from '../classes'
import { push } from 'object-path-immutable'

export const mutations: MutationTree<ErrorsState> = {
  add(state, error: GenericError | GenericError[]) {
    const errors = Array.isArray(error) ? error : [error]
    errors.forEach(
      e => (state.data = push(state.data, `${e.location}._errors`, e))
    )
  },
  set(state, error: GenericError | GenericError[]) {
    // ? Repetitive code. Use an action instead, calling reset then add?
    state.data = {}
    const errors = Array.isArray(error) ? error : [error]
    errors.forEach(
      e => (state.data = push(state.data, `${e.location}._errors`, e))
    )
  },
  reset(state) {
    state.data = {}
  }
}
