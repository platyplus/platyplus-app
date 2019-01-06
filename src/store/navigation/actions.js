export function routeRequest ({ dispatch, commit, state }, { path }) {
  commit('routeRequest', path)
}

export function route ({ dispatch, commit, state }, { path }) {
  path = state.routePath || path
  commit('routeReset')
  this.$router.replace(path)
}

export function toggleDrawer ({ dispatch, commit, state }) {
  commit('toggleDrawer')
}

export function setDrawer ({ dispatch, commit, state }, { value }) {
  commit('setDrawer', value)
}
