import request from '../utils/request'

export default {
  namespace: 'login',
  initState: {
    loginResult: {},
  },
  reducer: {
    login(state, { payload }) {
      return ({ ...state, loginResult: payload })
    },
    logout(state) {
      return ({ ...state })
    },
  },
}

const n = (name) => `login/${name}`

export const login = (params) => request.post('/blog/public_controller/login', n('login'), params)
export const logout = (params) => request.get('/blog/public_controller/logout', n('logout'), params)
