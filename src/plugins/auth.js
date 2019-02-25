import gql from 'graphql-tag'
import { apolloClient } from 'plugins/apollo'
import { queryHelper } from 'plugins/hasura'
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
    return apolloClient.readQuery({
      query: queryHelper({ table: 'user', fragment: 'full' }),
      variables: {
        where: { id: { _eq: getUserId() } }
      }
    }).user[0]
  }
}

export const loadUser = async () => {
  if (!getUserToken()) return null
  else {
    const { data } = await apolloClient.query({
      query: queryHelper({ table: 'user', fragment: 'full' }),
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
        return Boolean(getUserToken())
      },
      anonymous () {
        return !this.authenticated
      },
      user () {
        return getUser()
      }
    }
  })
}
