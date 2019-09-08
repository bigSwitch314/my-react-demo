import request from '../utils/request'

export default {
  namespace: 'role',
  initState: {
    roleList: {},
  },
  reducer: {
    getRoleList(state, { payload }) {
      return ({ ...state, roleList: payload })
    },
    addRole(state) {
      return ({ ...state })
    },
    editRole(state) {
      return ({ ...state })
    },
    changeStatus(state) {
      return ({ ...state })
    },
    deleteRole(state) {
      return ({ ...state })
    },
  },
}

const n = (name) => `role/${name}`

export const getRoleList = (params) => request.get('/blog/role/get', n('getRoleList'), params)
export const addRole = (params) => request.post('/blog/role/add', n('addRole'), params)
export const editRole = (params) => request.post('/blog/role/edit', n('editRole'), params)
export const deleteRole = (params) => request.post('/blog/role/delete', n('deleteRole'), params)
export const changeStatus = (params) => request.post('/blog/role/changeStatus', n('changeStatus'), params)
