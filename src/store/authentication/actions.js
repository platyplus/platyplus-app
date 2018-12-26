import { signin } from 'plugins/auth'
import { apolloClient } from 'plugins/apollo'
import { queryHelper } from 'plugins/hasura'

export async function login (
  { dispatch, commit, state },
  { username, password }
) {
  commit('loginRequest', { username })
  try {
    const user = await signin(username, password)
    const path = state.routePath || '/'
    commit('loginSuccess', user)
    localStorage.setItem('user', JSON.stringify(user))
    dispatch('loadProfile')
    this.$router.push(path)
  } catch (error) {
    commit('loginFailure', error)
    dispatch('alert/error', error, { root: true })
  }
}

export async function loadProfile ({ dispatch, commit, state }) {
  if (state.user.id) {
    const { data } = await apolloClient.query({
      query: queryHelper({ table: 'user', fragment: 'full' }),
      variables: {
        where: { id: { _eq: state.user.id } }
      }
    })
    commit('updateProfile', data.user[0])
  }
}

export async function updateUser ({ dispatch, commit, state }, user) {
  commit('updateProfile', user)
}

export function authRoute ({ dispatch, commit, state }, { path }) {
  commit('routeRequest', path)
}

export function logout ({ commit }) {
  localStorage.removeItem('user')
  commit('logout')
  this.$router.replace('/public')
}
