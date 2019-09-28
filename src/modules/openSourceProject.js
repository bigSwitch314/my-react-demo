import request from '../utils/request'

export default {
  namespace: 'openSourceProject',
  initState: {
    openSourceProjectList: {},
  },
  reducer: {
    getOpenSourceProjectList(state, { payload }) {
      return ({ ...state, openSourceProjectList: payload })
    },
    getOpenSourceProject(state, { payload }) {
      return ({ ...state, openSourceProject: payload })
    },
    addOpenSourceProject(state) {
      return ({ ...state })
    },
    editOpenSourceProject(state) {
      return ({ ...state })
    },
    changeReleaseStatus(state) {
      return ({ ...state })
    },
    deleteOpenSourceProject(state) {
      return ({ ...state })
    },
  },
}

const n = (name) => `openSourceProject/${name}`

export const getOpenSourceProjectList = (params) => request.get('/blog/open_source_project/get', n('getOpenSourceProjectList'), params)
export const getOpenSourceProject = (params) => request.get('/blog/open_source_project/get', n('getOpenSourceProject'), params)
export const addOpenSourceProject = (params) => request.post('/blog/open_source_project/add', n('addOpenSourceProject'), params)
export const editOpenSourceProject = (params) => request.post('/blog/open_source_project/edit', n('editOpenSourceProject'), params)
export const changeReleaseStatus = (params) => request.post('/blog/open_source_project/changeReleaseStatus', n('changeReleaseStatus'), params)
export const deleteOpenSourceProject = (params) => request.post('/blog/open_source_project/delete', n('deleteOpenSourceProject'), params)

