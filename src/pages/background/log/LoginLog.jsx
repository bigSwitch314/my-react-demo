import React from 'react'
// import { Icon, Avatar } from 'antd'


class LoginLog extends React.Component {
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
      <div>登录日志</div>
    )
  }
}

export default LoginLog
