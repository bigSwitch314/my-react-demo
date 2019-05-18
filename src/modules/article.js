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
    getArticle(state, { payload }) {
      return ({ ...state, article: payload })
    },
    addArticle(state) {
      return ({ ...state })
    },
    editArticle(state) {
      return ({ ...state })
    },
    changeReleaseStatus(state) {
      return ({ ...state })
    },
  },
}

const n = (name) => `article/${name}`

export const getArticleList = (params) => request.get('/blog/article/get', n('getArticleList'), params)
export const getArticle = (params) => request.get('/blog/article/get', n('getArticle'), params)
export const addArticle = (params) => request.post('/blog/article/add', n('addArticle'), params)
export const editArticle = (params) => request.post('/blog/article/add', n('editArticle'), params)
export const changeReleaseStatus = (params) => request.post('/blog/article/changeReleaseStatus', n('changeReleaseStatus'), params)

