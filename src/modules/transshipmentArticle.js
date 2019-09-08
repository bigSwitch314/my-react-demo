import request from '../utils/request'

export default {
  namespace: 'transshipmentArticle',
  initState: {
    transshipmentArticleList: {},
  },
  reducer: {
    getTransshipmentArticleList(state, { payload }) {
      return ({ ...state, transshipmentArticleList: payload })
    },
    getTransshipmentArticle(state, { payload }) {
      return ({ ...state, transshipmentArticle: payload })
    },
    addTransshipmentArticle(state) {
      return ({ ...state })
    },
    editTransshipmentArticle(state) {
      return ({ ...state })
    },
    changeReleaseStatus(state) {
      return ({ ...state })
    },
    deleteTransshipmentArticle(state) {
      return ({ ...state })
    },
  },
}

const n = (name) => `transshipmentArticle/${name}`

export const getTransshipmentArticleList = (params) => request.get('/blog/transshipment_article/get', n('getTransshipmentArticleList'), params)
export const getTransshipmentArticle = (params) => request.get('/blog/transshipment_article/getArticleDetail', n('getTransshipmentArticle'), params)
export const addTransshipmentArticle = (params) => request.post('/blog/transshipment_article/add', n('addTransshipmentArticle'), params)
export const editTransshipmentArticle = (params) => request.post('/blog/transshipment_article/edit', n('editArticle'), params)
export const changeReleaseStatus = (params) => request.post('/blog/transshipment_article/changeReleaseStatus', n('changeReleaseStatus'), params)
export const deleteTransshipmentArticle = (params) => request.post('/blog/transshipment_article/delete', n('deleteTransshipmentArticle'), params)

