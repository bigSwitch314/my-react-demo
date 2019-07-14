import React from 'react'
import ReactDOM from 'react-dom'
import store from './redux/store'
import Routers from './routers'
import { Provider } from 'react-redux'
import { LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import './styles/index.less'

window.log = window.console.log

ReactDOM.render(
  <Provider store={store}>
    <LocaleProvider locale={zhCN}>
      <Routers />
    </LocaleProvider>
  </Provider>,
  document.getElementById('root')
)
