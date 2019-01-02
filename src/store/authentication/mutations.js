export function loginRequest (state, user) {
  state.status = { loggingIn: true }
  state.user = user
}

export function loginSuccess (state, user) {
  state.status = { loggedIn: true }
  state.user = user
}

export function updateProfile (state, user) {
  state.user = { ...state.user, ...user }
}

export function loginFailure (state) {
  state.status = {}
  state.user = {}
}

export function logout (state) {
  state.status = {}
  state.user = {}
}
