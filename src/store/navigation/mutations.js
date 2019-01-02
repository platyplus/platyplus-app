export function routeRequest (state, path) {
  state.routePath = path
}

export function routeReset (state) {
  state.routePath = null
}
