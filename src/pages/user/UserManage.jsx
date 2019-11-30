import React from 'react'
import { connect } from 'react-redux';
import './style/UserManage.less'
import TabUser from './tabUser/Index'
import TabRole from './tabRole/Index'
import { Tabs } from 'antd'
import { getRoleList } from '@/modules/role'
import { getUserList } from '@/modules/user'


const TabPane = Tabs.TabPane

@connect(
  state => ({
    userList: state.user.userList,
    roleList: state.role.roleList,
  }),
  {
    getRoleList,
    getUserList,
  }
)
class UserManage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
    this.tabUserRef = React.createRef()
    this.tabRoleRef = React.createRef()
  }

  static getDerivedStateFromProps(props, state) {
    if (props.userList !== state.userList) {
      return { userList: props.userList }
    }

    return null
  }

  componentDidMount() {
    this.getUserList()
    this.getRoleList()
    this.setState({ activeKey: '1' })
  }

  // 获取用户列表
  getUserList = () => {
    this.props.getUserList({
      page_no: 1,
      page_size: 5,
    })
  }

  // 获取角色列表
  getRoleList = () => {
    this.props.getRoleList({
      page_no: 1,
      page_size: 5,
    })
  }

  // 角色数据变化处理函数
  onChangeRole = () => {
    this.tabUserRef.getUserList()
    this.tabUserRef.getAllRole()
  }

  // 用户数据变化处理函数
  onChangeUser = () => {
    this.tabRoleRef.getRoleList()
    this.tabRoleRef.getAllUser()
  }

  render() {
    const { userList, roleList } = this.props
    const userCount = userList.count || 0
    const roleCount = roleList && roleList.count || 0

    log('tabUserRef----', this.tabUserRef)
    log('tabRoleRef----', this.tabRoleRef)

    return (
      <div className="container">
        <Tabs
          defaultActiveKey="1"
          onChange={this.onChangeTab}
        >
          <TabPane tab={`用户列表(${userCount})`} key="1" forceRender={true}>
            <TabUser
              onChange={this.onChangeUser}
              wrappedComponentRef={(node) => this.tabUserRef = node}
            />
          </TabPane>
          <TabPane tab={`角色(${roleCount})`} key="2" forceRender={true}>
            <TabRole
              onChange={this.onChangeRole}
              ref={(node) => this.tabRoleRef = node}
            />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default UserManage
