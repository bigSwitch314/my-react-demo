import request from '../utils/request'

export default {
  namespace: 'user',
  initState: {
    userList: { },
  },
  reducer: {
    getUserList(state, { payload }) {
      return ({ ...state, userList: payload })
    },
    addUser(state) {
      return ({ ...state })
    },
    editUser(state) {
      return ({ ...state })
    },
    changeStatus(state) {
      return ({ ...state })
    },
    deleteUser(state) {
      return ({ ...state })
    },
    getAllUser(state, { payload }) {
      return ({ ...state, allUser: payload })
    },
  },
}

const n = (name) => `user/${name}`

export const getUserList = (params) => request.get('/blog/admin/get', n('getUserList'), params)
export const addUser = (params) => request.post('/blog/admin/add', n('addUser'), params)
export const editUser = (params) => request.post('/blog/admin/edit', n('editUser'), params)
export const deleteUser = (params) => request.post('/blog/admin/delete', n('deleteUser'), params)
export const changeStatus = (params) => request.post('/blog/admin/changeStatus', n('changeStatus'), params)
export const getAllUser = (params) => request.get('/blog/admin/get', n('getAllUser'), params)
