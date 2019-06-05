import React from 'react'
import './style/UserManage.less'
import TabUser from './tabUser'
import TabRole from './tabRole'
import { Tabs } from 'antd'


const TabPane = Tabs.TabPane

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
        <Tabs defaultActiveKey="1">
          <TabPane tab="用户列表(12)" key="1">
            <TabUser />
          </TabPane>
          <TabPane tab="角色(9)" key="2">
            <TabRole />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default UserManage
