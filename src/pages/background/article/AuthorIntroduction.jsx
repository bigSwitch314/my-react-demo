import React from 'react'
// import { Icon, Avatar } from 'antd'


class AuthorIntroduction extends React.Component {
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
      <div>作者简介</div>
    )
  }
}

export default AuthorIntroduction
