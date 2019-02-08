import gql from 'graphql-tag'
import { apolloClient } from 'plugins/apollo'
import { queryHelper } from 'plugins/hasura'
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

const ME = gql`
  query {
    me {
      id
      username
    }
  }
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
    const id = apolloClient.readQuery({ query: ME }).me?.id
    return apolloClient.readQuery({
      query: queryHelper({ table: 'user', fragment: 'full' }),
      variables: {
        where: { id: { _eq: id } }
      }
    }).user[0]
  }
}

export const loadUser = async () => {
  if (!getUserToken()) return null
  else {
    const { data } = await apolloClient.query({
      query: ME
    })
    const id = data.me?.id
    const query = await apolloClient.query({
      query: queryHelper({ table: 'user', fragment: 'full' }),
      variables: {
        where: { id: { _eq: id } }
      }
    })
    return query.data.user[0]
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
