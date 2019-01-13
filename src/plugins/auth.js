import axios from 'axios'
import { apolloClient } from 'plugins/apollo'
import { queryHelper } from 'plugins/hasura'

const AUTH_URL = `${process.env.HTTP_PROTOCOL}://${process.env.AUTH_API}`

export const signin = (username, password) =>
  axios
    .post(`${AUTH_URL}/login`, { username, password })
    .then(({ data }) => {
      return data
    })
    .catch(({ response }) => {
      throw response.data.error
    })

export const getUserId = () => {
  return JSON.parse(localStorage.getItem('user'))?.id
}

export const getUser = () => {
  const id = getUserId()
  if (id) {
    const data = apolloClient.readQuery({
      query: queryHelper({ table: 'user', fragment: 'full' }),
      variables: {
        where: { id: { _eq: id } }
      }
    })
    return data.user[0]
  } else return null
}

export const loadUser = async () => {
  const id = getUserId()
  if (id) {
    const { data } = await apolloClient.query({
      query: queryHelper({ table: 'user', fragment: 'full' }),
      variables: {
        where: { id: { _eq: id } }
      }
    })
    return data.user[0]
  } else return null
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
