import { ActionTree } from 'vuex'
// TODO where to put those routes? They need all the components to exist, and we don't want to add this to the common module
import { createRoutes } from '../../../../app/routes'
import { getRouter } from '../../router/instance'

import { RootState } from '../instance'
import { NavigationState } from './state'

export const actions: ActionTree<NavigationState, RootState> = {
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
  /**
   * Loads the routes from the tables schema. Triggerred after table schemas have been loaded into the store.
   * * This action only read the Vuex store and uses the Vuex actions to run some business logic.
   * * The new routes are stored into the vue-router instance, which is not part of the Vuex store, except
   * * with the state.navigation.router that is a pointer to the vue-router instance
   */
  loadRoutes: async () => {
    getRouter().addRoutes(createRoutes())
  }
}
