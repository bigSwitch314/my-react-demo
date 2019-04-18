import request from '../utils/request'

export default {
  namespace: 'article',
  initState: {
    articleList: {},
  },
  reducer: {
    getArticleList(state, { payload }) {
      return ({ ...state, articleList: payload })
    },
    // postUser(state) {
    //   return ({ ...state })
    // },
    // deleteUser(state) {
    //   return ({ ...state })
    // },
  },
}

const n = (name) => `article/${name}`

export const getArticleList = (params) => request.get('/blog/article/get', n('getArticleList'), params)
// export const postUser = (params) => request.post('/user', n('postUser'), params)
// export const deleteUser = (params) => request.delete('/user', n('deleteUser'), params)
