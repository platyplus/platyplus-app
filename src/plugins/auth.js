import gql from 'graphql-tag'
import { apolloClient } from 'plugins/apollo'
import { fragments } from 'plugins/platyplus/config/user'
export const signin = async (username, password) => {
  const { data } = await apolloClient.mutate({
    mutation: gql`
      mutation($username: String!, $password: String!) {
        login(username: $username, password: $password) {
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
}

// TODO: fragment
const ME = gql`
  query {
    me {
      ...user_full
    }
  }
  ${fragments.full}
`

export const signout = async () => {
  apolloClient.resetStore()
  localStorage.removeItem('token')
}

export function getUserToken () {
  return localStorage.getItem('token')
}

export const getUser = () => {
  if (!getUserToken()) return null
  else {
    return apolloClient.readQuery({ query: ME }).me
  }
}

export const loadUser = async () => {
  if (!getUserToken()) return null
  else {
    const { data } = await apolloClient.query({
      query: ME
    })
    return data.me
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
