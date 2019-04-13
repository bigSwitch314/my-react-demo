import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import monitorMiddleware from './middleware/monitorMiddleware'
import reducer from './reducer'


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

const store = createStore(reducer, initialState, enhancer)


// // 打印初始状态
// console.log(store.getState())

// // 每次 state 更新时，打印日志
// // 注意 subscribe() 返回一个函数用来注销监听器
// const unsubscribe = store.subscribe(() => console.log(store.getState()))

// // 发起一系列 action
// store.dispatch({ type: 'ADD_TODO', text: 'Learn about luo' })

// // 停止监听 state 更新
// unsubscribe()


export default store