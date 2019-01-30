import React from 'react'
// import { Icon, Avatar } from 'antd'


class TransshipmentArticle extends React.Component {
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
      <div>转载文章</div>
    )
  }
}

export default TransshipmentArticle
