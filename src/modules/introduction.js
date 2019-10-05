import request from '../utils/request'

export default {
  namespace: 'introduction',
  initState: {
    introduction: {},
  },
  reducer: {
    getIntroduction(state, { payload }) {
      return ({ ...state, introduction: payload })
    },
    addIntroduction(state) {
      return ({ ...state })
    },
    editIntroduction(state) {
      return ({ ...state })
    },
    deleteIntroduction(state) {
      return ({ ...state })
    },
  },
}

const n = (name) => `introduction/${name}`

export const getIntroduction = (params) => request.get('/blog/author_introduction/get', n('getIntroduction'), params)
export const addIntroduction = (params) => request.post('/blog/author_introduction/add', n('addIntroduction'), params)
export const editIntroduction = (params) => request.post('/blog/author_introduction/edit', n('editIntroduction'), params)
export const deleteIntroduction = (params) => request.post('/blog/author_introduction/delete', n('deleteIntroduction'), params)
