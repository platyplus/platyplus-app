import { ActionTree } from 'vuex'

import { apolloClient } from '@platyplus/hasura-apollo-client'

import tablesList from '../graphql/tablesList.graphql'
import tableQuery from '../graphql/table.graphql'
import { MetadataQuery, TableQuery } from '../types/queries'

import { MetadataState } from './state'

export const actions: ActionTree<MetadataState, {}> = {
  /**
   * Loads the metadata into the Apollo cache
   */
  onAuthenticated: {
    root: true,
    handler: async ({ rootGetters, dispatch }) => {
      if (rootGetters['authentication/authenticated']) {
        try {
          const {
            data: { _metadata: tableList }
          } = await apolloClient.query<MetadataQuery>({
            query: tablesList,
            fetchPolicy: 'cache-first' // * Make sure the query is cached regardless of any default fetchPolicy of the client
          })
          dispatch(
            'loading/startProgress',
            {
              key: 'metadata',
              target: tableList.length,
              message: 'loading metadata...' // TODO translate
            },
            { root: true }
          )
          for (const { name } of tableList) {
            await apolloClient.query<TableQuery>({
              query: tableQuery,
              variables: { name }
            })
            dispatch('loading/incrementProgress', 'metadata', { root: true })
          }
          dispatch('loading/stopProgress', 'metadata', { root: true })
          dispatch('navigation/loadRoutes', null, { root: true })
        } catch (error) {
          console.error('Error loading the metadata list')
          console.log(error)
        }
      }
    }
  }
}
