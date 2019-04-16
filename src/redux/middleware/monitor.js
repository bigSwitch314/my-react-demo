const SHOW = '@@loading-show'
const HIDE = '@@loading-hidden'

function createLoading(type, loading) {
  return ({
    type: loading ? SHOW : HIDE,
    payload: {
      namespace: type,
      [type]: loading,
    },
  })
}

export default ref => next => action => {
  const { dispatch, getState } = ref
  if (typeof action !== 'function') return next(action)
  const { promise, type } = action(dispatch, getState)
  if (promise instanceof Promise) {
    const loading = createLoading(type, true)
    const loaded = createLoading(type, false)
    next(loading)
    return promise
      .then(payload => {
        if (payload instanceof Error) {
          if (payload.name !== 'request error') {
            console.error(payload)
          }
          next(loaded)
          return payload
        }
        next(loaded)
        return next({ type, payload })
      })
  }
  return next(action) // todo 没必要使用
}

export function extraReducer(state = {}, { type, payload }) {
  const { namespace } = payload || {}
  let ret
  switch (type) {
    case SHOW:
      ret = {
        ...state,
        [namespace]: true,
      }
      break
    case HIDE:
      ret = {
        ...state,
        [namespace]: false,
      }
      break
    default:
      ret = state
      break
  }
  return ret
}
