import { ActionTree } from 'vuex'

import { apolloClient } from '@platyplus/hasura-apollo-client'
import { configTablesQuery } from '../../hasura/graphql'

import { RootState } from '..'
import { HasuraState } from './state'

export const actions: ActionTree<HasuraState, RootState> = {
  /**
   * Loads the schema from the hasura graphql engine backend into the Vuex store
   * Triggerred after we got a valid user token.
   * The result is loaded into Vuex store, whereas usual hasura data should be handled
   * by the Apollo cache system, in order to get a single source of truth.
   * * This exception is justified due to the fact that any other query/mutation/subscription
   * * may depend on this configuration data.
   */
  loadUserContext: {
    root: true,
    handler: async ({ dispatch, commit }) => {
      const {
        data: { table: tablesDefinition }
      } = await apolloClient.query({
        query: configTablesQuery
      })
      commit('initSchema', tablesDefinition)
      dispatch('navigation/loadRoutes', null, { root: true })
      dispatch('user/addUserRules', null, { root: true })
    }
    // TODO once done, trigger the asynchronous loading of the 'metadata' (e.g. org units and org unit types) into the apollo cache.
  }
}
