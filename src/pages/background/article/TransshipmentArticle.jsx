import React from 'react'
import { connect } from 'react-redux'
import { getUserList } from '../../../modules/userManage'


@connect(
  state => ({
    userList: state.user.userList,
    loading: state.loading['user/getUserList'],
  }),
  { getUserList }
)

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

  // 获取用户列表
  getUserList = () => {
    const { currentPage, pageSize } = this.state
    this.props.getUserList({
      current: currentPage,
      size: pageSize,
    })
  }

  componentDidMount() {
    this.getUserList()
    console.log(this.props)
  }

  render() {
    console.log(this.props)
    return (
      <div>
        转载文章
        <div onClick={this.getUserList}>添加</div>
      </div>

    )
  }
}

export default TransshipmentArticle
