import request from '../utils/request'

export default {
  namespace: 'menu',
  initState: {
    menuList: {},
  },
  reducer: {
    getMenuList(state, { payload }) {
      return ({ ...state, menuList: payload })
    },
    addMenu(state) {
      return ({ ...state })
    },
    editMenu(state) {
      return ({ ...state })
    },
    deleteMenu(state) {
      return ({ ...state })
    },
    batchUpdateSort(state) {
      return ({ ...state })
    },
  },
}

const n = (name) => `menu/${name}`

export const getMenuList = (params) => request.get('/blog/menu/get', n('getMenuList'), params)
export const addMenu = (params) => request.post('/blog/menu/add', n('addMenu'), params)
export const editMenu = (params) => request.post('/blog/menu/edit', n('editMenu'), params)
export const deleteMenu = (params) => request.post('/blog/menu/delete', n('deleteMenu'), params)
export const batchUpdateSort = (params) => request.post('/blog/menu/batchUpdateSort', n('batchUpdateSort'), params)
