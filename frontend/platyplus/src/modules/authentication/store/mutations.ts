import { MutationTree } from 'vuex'
import jwtDecode from 'jwt-decode'

import { ObjectMap, transformSqlLists } from '../../common'

import { UserState } from './state'

export const mutations: MutationTree<UserState> = {
  setToken(state, { token }) {
    const newToken: ObjectMap = jwtDecode(token)
    // * See the above workaround.
    // * It is quite important to translate the 'postgrest lists' into JS arrays as they are
    // * later used by the permissions system.
    newToken['https://hasura.io/jwt/claims'] = transformSqlLists(
      newToken['https://hasura.io/jwt/claims'] as ObjectMap
    )
    state.token = newToken
    state.encodedToken = token
  },

  reset(state) {
    state.encodedToken = undefined
    state.token = undefined
    state.profile = undefined
  },

  setProfile(state, profile) {
    state.profile = profile
  },

  setLocale(state, locale) {
    if (state.profile) state.profile.locale = locale
  }
}
