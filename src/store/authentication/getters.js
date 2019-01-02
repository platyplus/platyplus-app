export function userStatus (state) {
  return state.status
}

/**
 * Returns the user data as stored in Vuex
 * @param {*} state
 */
export function user (state) {
  return state.user
  // return Object.keys(state.user).reduce((acc, curr) => {
  //   acc[curr] = state.user[curr] || {}
  //   return acc
  // }, {})
}
