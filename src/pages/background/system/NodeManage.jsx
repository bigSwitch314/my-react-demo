import React from 'react'
// import { Icon, Avatar } from 'antd'


class NodeManage extends React.Component {
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
      <div>节点管理</div>
    )
  }
}

export default NodeManage
