import { MutationTree } from 'vuex'

import { NavigationState } from './state'

export const mutations: MutationTree<NavigationState> = {
  routeRequest(state, path) {
    state.routePath = path
  },
  routeReset(state) {
    state.routePath = undefined
  },
  toggleDrawer(state) {
    state.drawer = !state.drawer
  },
  setDrawer(state, value) {
    state.drawer = value
  },
  setTitle(state, title) {
    state.title = title
  }
}
