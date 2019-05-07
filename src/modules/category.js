import request from '../utils/request'

export default {
  namespace: 'category',
  initState: {
    categoryList: {},
  },
  reducer: {
    getCategoryList(state, { payload }) {
      return ({ ...state, categoryList: payload })
    },
    // postUser(state) {
    //   return ({ ...state })
    // },
    // deleteUser(state) {
    //   return ({ ...state })
    // },
  },
}

const n = (name) => `category/${name}`

export const getCategoryList = (params) => request.get('/blog/category/get', n('getCategoryList'), params)
// export const postUser = (params) => request.post('/user', n('postUser'), params)
// export const deleteUser = (params) => request.delete('/user', n('deleteUser'), params)
