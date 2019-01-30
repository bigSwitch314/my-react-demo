import React from 'react'
// import { Icon, Avatar } from 'antd'


class LabelManage extends React.Component {
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
      <div>标签管理</div>
    )
  }
}

export default LabelManage
