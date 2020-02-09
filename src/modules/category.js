import request from '../utils/request'

export default {
  namespace: 'category',
  initState: {
    categoryList: {},
    levelOneCategory: {},
  },
  reducer: {
    getCategoryList(state, { payload }) {
      return ({ ...state, categoryList: payload })
    },
    addCategory(state) {
      return ({ ...state })
    },
    editCategory(state) {
      return ({ ...state })
    },
    deleteCategory(state) {
      return ({ ...state })
    },
    getLevelOneCategory(state, { payload }) {
      return ({ ...state, levelOneCategory: payload })
    },
  },
}

const n = (name) => `category/${name}`

export const getCategoryList = (params) => request.get('/blog/category/get', n('getCategoryList'), params)
export const addCategory = (params) => request.post('/blog/category/add', n('addCategory'), params)
export const editCategory = (params) => request.post('/blog/category/edit', n('editCategory'), params)
export const deleteCategory = (params) => request.post('/blog/category/delete', n('deleteCategory'), params)
export const getLevelOneCategory = (params) => request.post('/blog/category/getLevelOneCategory', n('getLevelOneCategory'), params)
