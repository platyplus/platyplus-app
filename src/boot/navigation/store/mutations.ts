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
  // Creates a pointer to the vue router available from the Vuex store
  linkRouter(state, router) {
    state.router = router
  },
  setTitle(state, title) {
    state.title = title
  }
}
