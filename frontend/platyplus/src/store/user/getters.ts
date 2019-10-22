import { GetterTree } from 'vuex'

import { RootState } from '..'
import { UserState } from './state'

export const getters: GetterTree<UserState, RootState> = {
  authenticated(state) {
    return !!state.token && !!state.token.id
  },
  token(state) {
    return state.token
  },
  id(state) {
    return state.token && state.token.id
  },
  claims(state) {
    return state.token && state.token['https://hasura.io/jwt/claims']
  },
  encodedToken(state) {
    return state.encodedToken
  }
}
