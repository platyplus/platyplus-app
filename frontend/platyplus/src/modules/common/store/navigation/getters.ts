import { GetterTree } from 'vuex'

import { NavigationState } from './state'

export const getters: GetterTree<NavigationState, {}> = {
  drawer(state) {
    return state.drawer
  },
  title(state) {
    return state.title
  }
}
