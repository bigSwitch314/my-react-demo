import React from 'react'
import { connect } from 'react-redux';
import './style/UserManage.less'
import TabUser from './tabUser'
import TabRole from './tabRole'
import { Tabs } from 'antd'


const TabPane = Tabs.TabPane

@connect(
  state => ({
    userList: state.user.userList,
  })
)
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
    const { count = 0 } = this.props.userList
    return (
      <div className="container">
        <Tabs defaultActiveKey="1">
          <TabPane tab={`用户列表(${count})`} key="1">
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
