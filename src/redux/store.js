import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import monitorMiddleware from './middleware/monitor'
import rootReducer from './reducer'


const initialState = {
  visibilityFilter: 'SHOW_ALL',
  todos: [
    {
      text: 'Consider using Redux',
      completed: true,
    },
  ]
}

const devtools = process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
const enhancer = (devtools || compose)(
  applyMiddleware(monitorMiddleware, thunkMiddleware),
)

const store = createStore(rootReducer, initialState, enhancer)


export default store