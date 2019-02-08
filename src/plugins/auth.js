import gql from 'graphql-tag'
import { apolloClient } from 'plugins/apollo'
import { queryHelper } from 'plugins/hasura'

export const signin = async (username, password) => {
  const { data } = await apolloClient.mutate({
    mutation: gql`
      mutation($email: String!, $password: String!) {
        signin(email: $email, password: $password) {
          token
        }
      }
    `,
    variables: {
      username,
      password
    }
  })
  console.log(data)
  localStorage.setItem('user', JSON.stringify(data))
}

export const signout = async () => {
  apolloClient.resetStore()
  localStorage.removeItem('user')
}

export function getUserId () {
  return JSON.parse(localStorage.getItem('user'))?.id
}

export function getUserToken () {
  return JSON.parse(localStorage.getItem('user'))?.token
}

export const getUser = () => {
  if (!getUserId() || !getUserToken()) return null
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
  if (!getUserId() || !getUserToken()) return null
  const { data } = await apolloClient.query({
    query: queryHelper({ table: 'user', fragment: 'full' }),
    variables: {
      where: { id: { _eq: getUserId() } }
    }
  })
  return data.user[0]
}

export default ({ app, router, store, Vue }) => {
  Vue.mixin({
    computed: {
      authenticated () {
        return Boolean(getUserId())
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
