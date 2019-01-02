const user = JSON.parse(localStorage.getItem('user'))
const initialState = user
  ? { status: { loggedIn: true }, user }
  : {
    status: {},
    user: {}
  }
export default initialState
