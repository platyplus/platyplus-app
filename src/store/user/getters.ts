import { GetterTree } from 'vuex'

import { RootState } from '..'
import { UserState } from './state'
import { apolloClient } from 'src/hasura/apollo'
import { PROFILE_QUERY } from 'src/hasura/graphql/profile'
import { get } from 'object-path'

export const getters: GetterTree<UserState, RootState> = {
  authenticated(state) {
    return !!state.token && !!state.token.id
  },
  profile(state) {
    try {
      const result = apolloClient.readQuery({
        query: PROFILE_QUERY,
        variables: {
          id: get(state, ['token', 'id'])
        }
      })
      return get(result, ['user', '0'])
    } catch {
      return null
    }
  },
  token(state) {
    return state.token
  },
  claims(state) {
    return state.token && state.token['https://hasura.io/jwt/claims']
  },
  encodedToken(state) {
    return state.encodedToken
  }
}
