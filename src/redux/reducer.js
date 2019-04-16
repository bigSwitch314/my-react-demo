import { combineReducers } from 'redux'
import { extraReducer } from './middleware/monitor'

const context = require.context('../modules', false, /\/*\.js$/)

const reducers = context.keys()
  .filter(item => item !== './index.js')
  .map(key => context(key).default)
  .filter(item => item)


function handleReducer(models) {
  const {
    namespace,
    initState,
    reducer,
  } = models

  return function (state = initState, action) {
    const { type } = action
    return Object.keys(reducer).reduce((nemo, key) => {
      const newkey = `${namespace}/${key}`
      const fn = reducer[key]
      return newkey === type ? fn(state, action) : nemo
    }, state)
  }
}

const newReducers = reducers.reduce((obj, model) => {
  const key = model.namespace
  obj[key] = handleReducer(model)
  return obj
}, {})

const rootReducer = combineReducers({
  ...newReducers,
  loading: extraReducer,
})

export default rootReducer
