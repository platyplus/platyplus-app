import axios from 'axios'
import { apolloClient } from 'plugins/apollo'
import { queryHelper } from 'plugins/hasura'
import { getConfig } from '../helpers/config'

const AUTH_API = getConfig().AUTH_API
const AUTH_URL = `${window.location.protocol}//${AUTH_API}`

export const signin = async (username, password) => {
  const { data } = await axios.post(`${AUTH_URL}/login`, { username, password })
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
