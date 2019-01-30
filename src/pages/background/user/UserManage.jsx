import React from 'react'
// import { Icon, Avatar } from 'antd'


class UserManage extends React.Component {
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
      <div>用户管理</div>
    )
  }
}

export default UserManage
