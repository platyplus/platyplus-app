import { MutationTree } from 'vuex'
import jwtDecode from 'jwt-decode'

import { ability, initialRules } from 'src/hasura/ability'
import { ObjectMap } from 'src/types/common'

import { UserState } from './state'

/**
 * * Workaround for https://docs.hasura.io/1.0/graphql/manual/auth/authorization/roles-variables.html
 * Converts the values of the string properties of an object that are formated as a
 * PostgreSQL list into Javascript arrays.
 * @param from the initial object with possible properties such as "{something,something-else}"
 */
const transformSqlLists = (from: ObjectMap) => {
  for (const key of Object.keys(from)) {
    const value = from[key] as string
    if (
      typeof value === 'string' &&
      value.startsWith('{') &&
      value.endsWith('}')
    ) {
      from[key] = value
        .substring(1, value.length - 1)
        .split(',')
        .map(item => item.trim())
    }
  }
  return from
}

export const mutations: MutationTree<UserState> = {
  setToken(state, { token }) {
    const newToken: ObjectMap = jwtDecode(token)
    // * See the above workaround.
    // * It is quite important to translate the 'postgrest lists' into JS arrays as they are
    // * later used by the permissions system.
    newToken['https://hasura.io/jwt/claims'] = transformSqlLists(newToken[
      'https://hasura.io/jwt/claims'
    ] as ObjectMap)
    state.token = newToken
    state.encodedToken = token
  },

  signout(state) {
    state.encodedToken = undefined
    state.token = undefined
    state.rules = initialRules()
    ability.update(state.rules)
  },

  addRules(state, rules) {
    if (rules) state.rules.push(...rules)
    ability.update(state.rules)
  }
}
