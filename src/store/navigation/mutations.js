export function routeRequest (state, path) {
  state.routePath = path
}

export function routeReset (state) {
  state.routePath = null
}

export function toggleDrawer (state) {
  state.drawer = !state.drawer
}

export function setDrawer (state, value) {
  state.drawer = value
}
