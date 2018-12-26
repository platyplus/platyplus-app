const user = JSON.parse(localStorage.getItem('user'))
const initialState = user
  ? { status: { loggedIn: true }, user, routePath: null }
  : {
    status: {},
    user: {},
    routePath: null
  }
export default initialState
