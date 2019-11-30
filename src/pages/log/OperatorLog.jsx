import React from 'react'
// import { Icon, Avatar } from 'antd'


class OperatorLog extends React.Component {
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
      <div>操作日志</div>
    )
  }
}

export default OperatorLog
