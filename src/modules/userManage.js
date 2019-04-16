import request from '../utils/request'

export default {
  namespace: 'user',
  initState: {
    userList: {},
  },
  reducer: {
    getUserList(state, { payload }) {
      return ({ ...state, userList: payload })
    },
    postUser(state) {
      return ({ ...state })
    },
    deleteUser(state) {
      return ({ ...state })
    },
  },
}

const n = (name) => `user/${name}`

export const getUserList = (params) => request.get('/user', n('getUserList'), params)
export const postUser = (params) => request.post('/user', n('postUser'), params)
export const deleteUser = (params) => request.delete('/user', n('deleteUser'), params)
