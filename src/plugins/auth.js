import gql from 'graphql-tag'
import { apolloClient } from 'plugins/apollo'
import { queries } from 'plugins/platyplus'
export const signin = async (username, password) => {
  const { data } = await apolloClient.mutate({
    mutation: gql`
      mutation user_login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
          id
          token
        }
      }
    `,
    variables: {
      username,
      password
    }
  })
  localStorage.setItem('token', data.login.token)
  localStorage.setItem('userId', data.login.id)
}

export const signout = async () => {
  apolloClient.resetStore()
  localStorage.clear()
}

export function getUserToken () {
  return localStorage.getItem('token')
}

export function getUserId () {
  return localStorage.getItem('userId')
}

export const getUser = () => {
  if (!getUserToken()) return null
  else {
    try {
      return apolloClient.readQuery({
        query: queries.user.profile,
        variables: {
          where: { id: { _eq: getUserId() } }
        }
      }).user[0]
    } catch (e) {
      return null
    }
  }
}

export const loadUser = async () => {
  if (!getUserToken()) return null
  else {
    const { data } = await apolloClient.query({
      query: queries.user.profile,
      variables: {
        where: { id: { _eq: getUserId() } }
      }
    })
    return data.user[0]
  }
}

export default ({ app, router, store, Vue }) => {
  Vue.mixin({
    computed: {
      authenticated () {
        // TODO make it reactive -> vuex?
        return Boolean(getUserToken())
      },
      anonymous () {
        return !this.authenticated
      },
      user () {
        // TODO: make it reactive - through a custom/this mixin + reactive apollo?
        return getUser()
      }
    }
  })
}
