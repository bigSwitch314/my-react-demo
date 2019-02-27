import React from "react"
import ReactDOM from "react-dom"
import Routers from './routers'
import { LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN';


ReactDOM.render(
  <LocaleProvider locale={zhCN}>
    <Routers />
  </LocaleProvider>,
  document.getElementById("root")
)
