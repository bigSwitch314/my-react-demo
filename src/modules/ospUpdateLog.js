import request from '../utils/request'

export default {
  namespace: 'ospUpdateLog',
  initState: {
    ospUpdateLogList: {},
  },
  reducer: {
    getOspUpdateLogList(state, { payload }) {
      return ({ ...state, ospUpdateLogList: payload })
    },
    getOspUpdateLog(state, { payload }) {
      return ({ ...state, ospUpdateLog: payload })
    },
    addOspUpdateLog(state) {
      return ({ ...state })
    },
    editOspUpdateLog(state) {
      return ({ ...state })
    },
    deleteOspUpdateLog(state) {
      return ({ ...state })
    },
  },
}

const n = (name) => `ospUpdateLog/${name}`

export const getOspUpdateLogList = (params) => request.get('/blog/open_source_project/getUpdateLog', n('getospUpdateLogList'), params)
export const getOspUpdateLog = (params) => request.get('/blog/open_source_project/getUpdateLog', n('getospUpdateLog'), params)
export const addOspUpdateLog = (params) => request.post('/blog/open_source_project/addUpdateLog', n('addospUpdateLog'), params)
export const editOspUpdateLog = (params) => request.post('/blog/open_source_project/editUpdateLog', n('editospUpdateLog'), params)
export const deleteOspUpdateLog = (params) => request.post('/blog/open_source_project/deleteUpdateLog', n('deleteospUpdateLog'), params)

