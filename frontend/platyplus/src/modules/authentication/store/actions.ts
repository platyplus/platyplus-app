import { ActionTree } from 'vuex'

import { UserState } from './state'

import {
  LOGIN_MUTATION,
  PROFILE_QUERY,
  UPDATE_LOCALE,
  UPDATE_PREFERRED_ORG_UNIT
} from '../graphql'

import { User } from '../types'
import { getApolloClient } from '..'

export const actions: ActionTree<UserState, {}> = {
  async signin({ commit, dispatch }, { username, password }) {
    // TODO dispatch errors reset rather when the navigation changes?
    // commit('errors/reset', null, { root: true })
    try {
      const { data } = await getApolloClient().mutate({
        mutation: LOGIN_MUTATION,
        variables: {
          username,
          password
        }
      })
      dispatch('loading/start', 'Authentication', { root: true })
      commit('setToken', data.login)
      // Triggers global Vuex actions that are required to use the application as an authenticated user.
      // In particular the user profile (in the Vuex user module) and the tables schema (in this Vuex hasura module).
      await dispatch('onAuthenticated', null, { root: true })
    } catch (error) {
      console.error(error) // TODO handle this
    } finally {
      dispatch('loading/stop', null, { root: true })
    }
  },

  /**
   * Loads the profile information from the hasura graphql engine backend into the Vuex store
   * Triggerred after we got a valid user token.
   * The result is loaded into Vuex store, whereas usual hasura data should be handled
   * by the Apollo cache system, in order to get a single source of truth.
   * * This exception is justified due to the fact that any other query/mutation/subscription
   * * may depend on this configuration data.
   */
  onAuthenticated: {
    root: true,
    handler: async ({ state, commit, dispatch }) => {
      // TODO handle errors
      if (!(state.token && state.token.id)) return // TODO handle this error
      const {
        data: { profile }
      }: { data: { profile: User } } = await getApolloClient().query({
        query: PROFILE_QUERY,
        variables: {
          id: state.token.id
        }
      })
      commit('setProfile', profile)
      await dispatch('setLocale', profile.locale, { root: true })
    }
  },

  setLocale: {
    root: true,
    handler: async ({ getters, commit }, locale) => {
      const profile = getters['profile']
      if (profile.locale && profile.locale !== locale) {
        // * update the locale through a mutation
        await getApolloClient().mutate({
          mutation: UPDATE_LOCALE,
          variables: {
            userId: profile.id,
            locale
          }
        })
        commit('setLocale', locale)
      }
    }
  },

  udpatePreferredOrgUnit: async ({ getters }, id) => {
    const profile = getters['profile']
    if (profile) {
      await getApolloClient().mutate({
        mutation: UPDATE_PREFERRED_ORG_UNIT,
        variables: {
          userId: profile.id,
          orgUnitId: id
        }
      })
    }
  },

  signout: {
    root: true,
    handler: async ({ commit, dispatch }) => {
      dispatch('loading/start', 'Signout', { root: true }) // TODO translate
      commit('reset')
      getApolloClient().resetStore()
      // ? reset other Vuex modules?
      dispatch('loading/stop', 'Signout', { root: true }) // TODO translate
    }
  }
}
