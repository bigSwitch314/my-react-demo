import React from 'react'
// import { Icon, Avatar } from 'antd'
// import Editor from '../../../components/markdown'


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
    // const { value } = this.state

    return (
      <div>
        个人简介
      </div>
    )
  }
}

export default AuthorIntroduction
