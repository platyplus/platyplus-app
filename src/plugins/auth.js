import axios from 'axios'
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

export default ({ app, router, store, Vue }) => {
  Vue.mixin({
    computed: {
      authenticated () {
        return store.getters['authentication/userStatus'].loggedIn
      },
      anonymous () {
        return !this.authenticated
      },
      user () {
        return store.getters['authentication/user']
      }
    }
  })
}
