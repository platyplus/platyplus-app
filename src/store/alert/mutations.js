export function success (state, message) {
  state.type = 'alert-success'
  state.message = message
}

export function error (state, message) {
  state.type = 'alert-danger'
  state.message = message
}

export function clear (state) {
  state.type = null
  state.message = null
}
