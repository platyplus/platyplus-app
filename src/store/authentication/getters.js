export function userStatus (state) {
  return state.status
}

/**
 * Returns the user data as stored in Vuex, TODO: but replaces each null value
 * by {} so they can be browsed without raising an error.
 * @param {*} state
 */
export function user (state) {
  // TODO: still being used? Store user info in apollo local state instead of Vuex?
  return state.user
  // return Object.keys(state.user).reduce((acc, curr) => {
  //   acc[curr] = state.user[curr] || {}
  //   return acc
  // }, {})
}
