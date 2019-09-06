import { GetterTree } from 'vuex'

import { RootState } from '..'
import { NavigationState } from './state'

export const getters: GetterTree<NavigationState, RootState> = {
  drawer(state) {
    return state.drawer
  },
  title(state) {
    return state.title
  }
}
