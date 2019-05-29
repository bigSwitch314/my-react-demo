import React from 'react'
// import { Icon, Avatar } from 'antd'
import TitleTabs from '@/components/shared/TitleTabs'

const TabPane = TitleTabs.TabPane

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
      <div className="container">
        <TitleTabs type="card">
          <TabPane tab="用户列表" key="1">
            用户列表
          </TabPane>
          <TabPane tab="角色" key="2">
            角色
          </TabPane>
        </TitleTabs>
      </div>
    )
  }
}

export default UserManage
