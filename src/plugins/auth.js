import gql from 'graphql-tag'
import { apolloClient } from 'plugins/apollo'
export const signin = async (username, password) => {
  console.log(username)
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
  console.log(data.login)
  localStorage.setItem('token', data.login.token)
}

export const signout = async () => {
  apolloClient.resetStore()
  localStorage.removeItem('token')
}

export function getUserToken () {
  console.log(localStorage.getItem('token'))
  return localStorage.getItem('token')
}

export const getUser = () => {
  if (!getUserToken()) return null
  else {
    return apolloClient.readQuery({
      // TODO: fragment
      query: gql`
        me {
          id
          username
        }
      `
    })
  }
}

export const loadUser = async () => {
  if (!getUserToken()) return null
  else {
    const { data } = await apolloClient.query({
      // TODO: fragment
      query: gql`
        me {
          id
          username
        }
      `
    })
    console.log(data)
    return data
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
