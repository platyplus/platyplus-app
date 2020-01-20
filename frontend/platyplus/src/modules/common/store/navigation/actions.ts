import { ActionTree } from 'vuex'
import { getRouter } from '../../router/instance'
import { NavigationState } from './state'

export const actions: ActionTree<NavigationState, {}> = {
  routeRequest({ commit }, { path }) {
    commit('setDrawer', false)
    commit('routeRequest', path)
  },
  route({ commit, state }, { path }) {
    path = state.routePath || path
    commit('routeReset')
    getRouter()
      .replace(path)
      .catch(() => {
        console.debug('NavigationDuplicated')
      })
  },
  toggleDrawer({ commit }) {
    commit('toggleDrawer')
  },
  setDrawer({ commit }, { value }) {
    commit('setDrawer', value)
  },
  // * Dummy action, to allow the route loading action to be defined in another module without raising an error if it is not
  loadRoutes: {
    root: true,
    handler: () => null
  }
}
