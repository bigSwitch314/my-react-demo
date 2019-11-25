import request from '../utils/request'

export default {
  namespace: 'role',
  initState: {
    roleList: {},
    allRole: {},
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
    getMenuNodeTree(state, { payload }) {
      return ({ ...state, menuNodeTree: payload })
    },
    bindAccount(state) {
      return ({ ...state })
    },
    getAllRole(state, { payload }) {
      return ({ ...state, allRole: payload })
    },
  },
}

const n = (name) => `role/${name}`

export const getRoleList = (params) => request.get('/blog/role/get', n('getRoleList'), params)
export const addRole = (params) => request.post('/blog/role/add', n('addRole'), params)
export const editRole = (params) => request.post('/blog/role/edit', n('editRole'), params)
export const deleteRole = (params) => request.post('/blog/role/delete', n('deleteRole'), params)
export const changeStatus = (params) => request.post('/blog/role/changeStatus', n('changeStatus'), params)
export const getMenuNodeTree = (params) => request.get('/blog/role/getMenuNodeTree', n('getMenuNodeTree'), params)
export const bindAccount = (params) => request.post('/blog/role/bindAccount', n('bindAccount'), params)
export const getAllRole = (params) => request.post('/blog/role/get', n('getAllRole'), params)
