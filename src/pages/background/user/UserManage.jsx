import React from 'react'
import TitleTabs from '@/components/shared/TitleTabs'
import './style/UserManage.less'
import TabUser from './tabUser'
import TabRole from './tabRole'

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
            <TabUser />
          </TabPane>
          <TabPane tab="角色" key="2">
            <TabRole />
          </TabPane>
        </TitleTabs>
      </div>
    )
  }
}

export default UserManage
