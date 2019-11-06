import request from '../utils/request'

export default {
  namespace: 'node',
  initState: {
    nodeList: {},
  },
  reducer: {
    getNodeList(state, { payload }) {
      return ({ ...state, nodeList: payload })
    },
    addNode(state) {
      return ({ ...state })
    },
    editNode(state) {
      return ({ ...state })
    },
    deleteNode(state) {
      return ({ ...state })
    },
    getLevelOneNode(state, { payload }) {
      return ({ ...state, levelOneNode: payload })
    },
  },
}

const n = (name) => `node/${name}`

export const getNodeList = (params) => request.get('/blog/node/get', n('getNodeList'), params)
export const addNode = (params) => request.post('/blog/node/add', n('addNode'), params)
export const editNode = (params) => request.post('/blog/node/edit', n('editNode'), params)
export const deleteNode = (params) => request.post('/blog/node/delete', n('deleteNode'), params)
export const getLevelOneNode = (params) => request.post('/blog/node/getLevelOneNode', n('getLevelOneNode'), params)