import React from 'react'

import Left from './Left'
import Right from './Right'
import './index.less'

const HeaderBar = (props) => (
  <div className="header-bar">{props.children}</div>
)

HeaderBar.Left = Left
HeaderBar.Right = Right

export default HeaderBar
