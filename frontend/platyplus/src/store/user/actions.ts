import { ActionTree } from 'vuex'
import { get, coalesce } from 'object-path'

import { apolloClient } from '@platyplus/hasura-apollo-client'
import { hasuraToSift } from 'src/hasura/ability'
import {
  LOGIN_MUTATION,
  PROFILE_QUERY,
  UPDATE_PREFERRED_ORG_UNIT
} from 'src/hasura/graphql/profile'

import { RootState } from '..'
import { UserState } from './state'
import { Rule } from 'src/types/rule'

export const actions: ActionTree<UserState, RootState> = {
  async signin({ commit, dispatch }, { username, password }) {
    // TODO dispatch errors reset rather when the navigation changes?
    commit('errors/reset', null, { root: true })
    try {
      const { data } = await apolloClient.mutate({
        mutation: LOGIN_MUTATION,
        variables: {
          username,
          password
        }
      })
      commit('setToken', data.login)
      // Triggers global Vuex actions that are required to use the application as an authenticated user.
      // In particular the user profile (in the Vuex user module) and the tables schema (in this Vuex hasura module).
      await dispatch('loadUserContext', null, { root: true })
    } catch (error) {
      //eslint-ignoe-next-line no-empty
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
  loadUserContext: {
    root: true,
    handler: async ({ state }) => {
      // TODO handle errors
      if (!(state.token && state.token.id)) return // TODO handle this error
      await apolloClient.query({
        query: PROFILE_QUERY,
        variables: {
          id: state.token.id
        }
      })
    }
  },

  udpatePreferredOrgUnit: async ({ getters }, id) => {
    const profile = getters['profile']
    if (profile) {
      await apolloClient.mutate({
        mutation: UPDATE_PREFERRED_ORG_UNIT,
        variables: {
          userId: profile.id,
          orgUnitId: id
        }
      })
      // TODO write into cache?
      // commit('setProfile', get(result, 'data.update_user.returning.0'))
    }
  },

  /**
   * TODO document
   */
  addUserRules: async ({ commit, getters, rootGetters }) => {
    // TODO Add the rule that once cannot insert an element if they cannot insert all the PK columns
    const hasuraClaims = getters['claims']
    if (!hasuraClaims) return // TODO handle this error?
    const schema = rootGetters['hasura/schema']
    const newRules: Rule[] = []
    const permissionTypes = ['delete', 'insert', 'update', 'select']
    for (const tableClass of schema.classes) {
      for (const permission of tableClass.table.permissions) {
        for (const permissionType of permissionTypes) {
          if (get(permission, permissionType)) {
            const rule: Rule = {
              actions: permissionType,
              subject: tableClass.name
            }
            const fields: string[] = get(
              permission,
              `${permissionType}.columns`,
              []
            )
            const filter = coalesce(
              permission,
              [`${permissionType}.filter`, `${permissionType}.check`],
              {}
            )
            // TODO raise warnings when on enough permission to read the label?
            if (
              // No permission no insert/select if no permission to insert/select all the pk columns
              ['insert', 'select'].includes(permissionType) &&
              !tableClass.idColumnNames.every((colName: string) => {
                if (fields.includes(colName)) {
                  return true
                } else {
                  console.warn(
                    // prettier-ignore
                    `Permission to ${permissionType} the primary key column '${colName}' on the table '${tableClass.name}' is required.`
                  )
                  return false
                }
              })
            ) {
              rule.inverted = true
            } else {
              if (fields.length) rule.fields = fields
              if (Object.keys(filter).length)
                rule.conditions = hasuraToSift(filter, hasuraClaims)
            }
            newRules.push(rule)
          }
        }
      }
    }
    commit('addRules', newRules)
  },

  signout({ commit }) {
    commit('signout')
    apolloClient.resetStore()
    // TODO reset the Vuex stores e.g. rules and ability, table schema etc.
  }
}
