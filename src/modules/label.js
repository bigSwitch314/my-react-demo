import request from '../utils/request'

export default {
  namespace: 'label',
  initState: {
    labelList: {},
  },
  reducer: {
    getLabelList(state, { payload }) {
      return ({ ...state, labelList: payload })
    },
    addLabel(state) {
      return ({ ...state })
    },
    editLabel(state) {
      return ({ ...state })
    },
    deleteLabel(state) {
      return ({ ...state })
    },
  },
}

const n = (name) => `label/${name}`

export const getLabelList = (params) => request.get('/blog/label/get', n('getLabelList'), params)
export const addLabel = (params) => request.post('/blog/label/add', n('addLabel'), params)
export const editLabel = (params) => request.post('/blog/label/edit', n('editLabel'), params)
export const deleteLabel = (params) => request.post('/blog/label/delete', n('deleteLabel'), params)
