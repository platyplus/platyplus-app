import gql from 'graphql-tag'
import { apolloClient } from 'boot/apollo'
import { queries } from 'boot/platyplus'
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
    // TODO return the user?
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
  const userId = getToken().id
  if (!userId) return {}
  try {
    const data = apolloClient.readQuery({
      query: queries.user.profile,
      variables: { userId }
    })
    return data.user[0]
  } catch (e) {
    return {}
  }
}

export const loadUser = async () => {
  if (!getToken().id) return {}
  const { data } = await apolloClient.query({
    query: queries.user.profile
  })
  return data.user[0]
}

export default ({ app, router, store, Vue }) => {
  Vue.mixin({
    data () {
      return {
        user: {},
        token: {}
      }
    },
    computed: {
      authenticated () {
        return Boolean(this.user.id)
      }
    },
    apollo: {
      user: {
        query: queries.user.profile,
        skip () {
          return !this.token.id
        },
        update: ({ user }) => user[0]
      },
      token: {
        query: TOKEN,
        update: ({ token }) => token
      }
    }
  })
}
