import axios from 'axios'
import { apolloClient } from 'plugins/apollo'
import { queryHelper } from 'plugins/hasura'

const AUTH_URL = `${process.env.HTTP_PROTOCOL}://${process.env.AUTH_API}`

export const signin = async (username, password) => {
  const { data } = await axios.post(`${AUTH_URL}/login`, { username, password })
  localStorage.setItem('user', JSON.stringify(data))
}

export const signout = async () => {
  localStorage.removeItem('user')
}

export const getUserId = () => JSON.parse(localStorage.getItem('user'))?.id

export const getUserToken = () =>
  JSON.parse(localStorage.getItem('user'))?.token

export const getUser = () =>
  apolloClient.readQuery({
    query: queryHelper({ table: 'user', fragment: 'full' }),
    variables: {
      where: { id: { _eq: getUserId() } }
    }
  }).user[0]

export const loadUser = async () => {
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
