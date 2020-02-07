import React from 'react'
import ReactDOM from 'react-dom'
import store from './redux/store'
import Routers from './routers'
import { Provider } from 'react-redux'
import { LocaleProvider, message } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import './styles/index.less'
import '@/assets/iconfont/iconfont.css'

window.log = window.console.log

message.config({ maxCount: 1 })

ReactDOM.render(
  <Provider store={store}>
    <LocaleProvider locale={zhCN}>
      <Routers />
    </LocaleProvider>
  </Provider>,
  document.getElementById('root')
)
