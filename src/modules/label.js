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
    // postUser(state) {
    //   return ({ ...state })
    // },
    // deleteUser(state) {
    //   return ({ ...state })
    // },
  },
}

const n = (name) => `label/${name}`

export const getLabelList = (params) => request.get('/blog/label/get', n('getLabelList'), params)
// export const postUser = (params) => request.post('/user', n('postUser'), params)
// export const deleteUser = (params) => request.delete('/user', n('deleteUser'), params)
