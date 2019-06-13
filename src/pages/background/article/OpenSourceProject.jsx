import React from 'react'
// import { Tabs } from 'antd'
import './style/OpenSourceProject.less'


class OpenSourceProject extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.userList !== state.userList) {
      return { userList: props.userList }
    }

    return null
  }

  componentDidMount() {

  }

  render() {
    return (
      <div className="container">
        开源项目
      </div>
    )
  }
}

export default OpenSourceProject
