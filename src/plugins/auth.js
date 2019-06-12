import gql from 'graphql-tag'
import { apolloClient } from 'plugins/apollo'
import { queries } from 'plugins/platyplus'
import jwtDecode from 'jwt-decode'

export const TOKEN = gql`
  query {
    token @client {
      id
      encoded
    }
  }
`

export function updateToken (_, { token }, { cache }) {
  let oldToken = {}
  try {
    oldToken = cache.readQuery({ query: TOKEN }).token
  } catch (e) {}
  const decodedToken = jwtDecode(token)
  const data = Object.assign(oldToken, {
    // TODO deep clone?
    token: {
      ...oldToken,
      __typename: 'token',
      id: decodedToken.id,
      encoded: token
    }
  })
  cache.writeData({ data })
  return data
}

export const signin = async (username, password) => {
  const { data } = await apolloClient.mutate({
    mutation: gql`
      mutation user_login($username: String!, $password: String!) {
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
  await apolloClient.mutate({
    mutation: gql`
      mutation updateProfile($token: String!) {
        updateToken(token: $token) @client
      }
    `,
    variables: {
      token: data.login.token
    }
  })
}

export const signout = () => {
  apolloClient.resetStore()
}

export const getToken = () => {
  try {
    return apolloClient.readQuery({ query: TOKEN }).token
  } catch (e) {
    return {}
  }
}

export const isAuthenticated = () => {
  return Boolean(getToken().id && getUser().id)
}

export const getUser = () => {
  try {
    const token = getToken()
    const { user } = apolloClient.readQuery({
      query: queries.user.profile,
      variables: { where: { id: { _eq: token.id } } }
    })
    return user[0]
  } catch (e) {
    return {}
  }
}

export const loadUser = async () => {
  const user = getUser()
  if (user.id) return user
  const token = getToken()
  if (!token.id) return {}
  const { data } = await apolloClient.query({
    query: queries.user.profile,
    variables: {
      where: { id: { _eq: user.id } }
    }
  })
  return data.user[0]
}

export default ({ app, router, store, Vue }) => {
  Vue.mixin({
    data () {
      return {
        token: {},
        user: {}
      }
    },
    computed: {
      authenticated () {
        return Boolean(this.user.id && this.token.id)
      },
      anonymous () {
        return !this.authenticated
      }
    },
    apollo: {
      token: {
        query: TOKEN
      },
      user: {
        query: queries.user.profile,
        variables () {
          return {
            where: {
              id: { _eq: this.token.id }
            }
          }
        },
        skip () {
          return !this.token.id
        },
        update: data => data.user[0]
      }
    }
  })
}
