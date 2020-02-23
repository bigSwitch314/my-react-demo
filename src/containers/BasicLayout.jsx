import React from 'react'
import { connect } from 'react-redux'
import {Route, Link, Switch, Redirect} from 'react-router-dom'
import { Layout, Menu, Avatar, Modal, Input, Form, message } from 'antd'
import { getRoutesData } from '../router/menu'
import { getMenus, getRoutes, getParentKey, getCurrentRoute } from '../router/utils'
import { removeLogin } from '../components/Authentication/util'
import { logout } from '@/modules/login'
import { modifyPassword } from '@/modules/user'
import { passwordValidate } from '@/utils/validator'

import './style/BasicLayout.less'

const { Header, Content, Sider } = Layout
const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
}

const menuCodes = {
  文章管理: '001',
  分类管理: '002',
  标签管理: '003',
  账号管理: '004',
  日志管理: '005',
  系统设置: '006',
  原创文章: '001001',
  转载文章: '001002',
  个人简介: '001003',
  开源项目: '001004',
  操作日志: '005001',
  登录日志: '005002',
  导航菜单: '006001',
  节点管理: '006002',
}


@Form.create()
@connect(
  state => ({
    loading: state.loading['login/logout'],
  }),
  { logout, modifyPassword },
)

class BasicLayout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      menuData: [],
      getRoutes: [],
      routeMap: new Map(),
      collapsed: false,
      openkeys: '',
      confirmDirty: false,
      visible: false,
    }
    this.userId=null
  }

  static getDerivedStateFromProps(props, state) {
    if (props.userList !== state.userList) {
      return { userList: props.userList }
    }

    const { routeMap, routesData } = getRoutesData(menuCodes)
    return {
      menuData: getMenus('!/userTest', routesData),
      normalRoutes: getRoutes(/^(?!userTest)/, routesData),
      routeMap,
    }
  }

  componentDidMount() {
    const userInfo = sessionStorage.getItem('userInfo')
    const { userName, userId } = JSON.parse(userInfo) || {}
    if(!userName) {
      return this.logout()
    }
    this.setState({ userName })
    this.userId = userId
  }

  logout = () => {
    removeLogin()
    window.location.reload()
  }

  onCollapse = (collapsed) => {
    if (collapsed) {
      this.setState({ openkeys: '' }, () => this.setState({ collapsed }))
    } else {
      const { location: { pathname }, routeMap } = this.props
      const openkeys = getParentKey(pathname, routeMap)
      this.setState({ openkeys, collapsed })
    }
  }

  onOpenChange = (openkeys) => {
    const latestOpenKey = openkeys.find(key => this.state.openkeys.indexOf(key) === -1)
    this.setState({
      openkeys: latestOpenKey || '',
    })
  }

  // 修改密码相关方法

  showChangePasswordModal = () => {
    this.setState({ visible: true })
  }
  onOk = () => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.modifyPassword({
          userid: this.userId,
          old_password: values.oldPassword,
          new_password: values.newPassword,
        }).then(error => {
          if (error instanceof Error) return
          message.success('修改成功，请重新登录', 1, () => {
            this.setState({ visible: false }, () => {
              this.logout()
            })
          })
        })
      }
    })
  }

  onCancel = () => {
    this.setState({ visible: false }, () => {
      this.props.form.setFieldsValue({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    })
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirmPassword'], { force: true });
    }
    callback();
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('newPassword')) {
      callback('密码必须一致!');
    } else {
      callback();
    }
  }

  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  render() {
    const { menuData, normalRoutes, routeMap, collapsed, openkeys, userName='', visible } = this.state
    const { getFieldDecorator } = this.props.form
    const { location } = this.props
    const currentRoute = getCurrentRoute(location.pathname, routeMap)
    const { key, parentPath } = currentRoute
    let selectkeys = parentPath ? [parentPath, key] : [key]
    selectkeys = collapsed ? selectkeys : [key]

    return (
      <Layout className="basic-layout">
        <Header className="basic-layout-header">
          <div className="basic-layout-header-left">
            <Link to={'/admin/home/'}>
              <span className="logo" />
              <span>博客管理平台</span>
            </Link>
          </div>
          <div className="basic-layout-header-right">
            <span title="修改密码" onClick={() => this.showChangePasswordModal()}>
              <span className="avatar">
                <Avatar size="small"><i className="iconfont icon-user" /></Avatar>
              </span>
              <span className="name">{userName}</span>
            </span>
            <span title="退出">
              <i className="iconfont icon-logout" onClick={this.logout} />
            </span>
          </div>
        </Header>
        <Content className="basic-layout-content">
          <Layout style={{ width: '100%'}}>
            <Sider
              width={256}
              className="basic-layout-sider"
              collapsible
              collapsed={collapsed}
              onCollapse={this.onCollapse}
            >
              <div style={{ width: 256 }}>
                <Menu className="menu"
                  openKeys={[openkeys]}
                  onOpenChange={this.onOpenChange}
                  selectedKeys={selectkeys}
                  mode="inline"
                  theme="dark"
                >
                  {menuData}
                </Menu>
              </div>
            </Sider>
            <Content className="basic-layout-container">
              <div className="basic-content">
                <Switch>
                  {normalRoutes.map(routes => routes.children.length > 0 ?
                    routes.children.map(route => (
                      <Route
                        extra
                        key={route.key}
                        path={route.fullPath}
                        component={route.component}
                      />
                    )) :
                    <Route
                      extra
                      key={routes.key}
                      path={routes.fullPath}
                      component={routes.component}
                    />,
                  )}
                  <Redirect to={normalRoutes[0].children[0].fullPath} />
                </Switch>
              </div>
            </Content>
          </Layout>
        </Content>
        {/* 密码修改弹窗 */}
        <Modal
          title="修改密码"
          width={500}
          visible={visible}
          onOk={this.onOk}
          onCancel={this.onCancel}
        >
          <div style={{ position: 'relative', left: '40px' }}>
            <FormItem
              label="原始密码"
              {...formItemLayout}
            >
              {getFieldDecorator('oldPassword', {
                rules: [{
                  required: true,
                  message: '请输原始入密码',
                  whitespace: true,
                }, {
                  min: 6, max: 16, message: '密码为6-16位',
                },
                ...passwordValidate,
                ],
              })(
                <Input type="password" />,
              )}
            </FormItem>
            <FormItem
              label="新密码"
              {...formItemLayout}
            >
              {getFieldDecorator('newPassword', {
                rules: [{
                  required: true,
                  message: '请输入密码',
                  whitespace: true,
                }, {
                  validator: this.validateToNextPassword,
                }, {
                  min: 6, max: 16, message: '密码为6-16位',
                },
                ...passwordValidate,
                ],
              })(
                <Input type="password" />,
              )}
            </FormItem>
            <FormItem
              label="确认密码"
              {...formItemLayout}
            >
              {getFieldDecorator('confirmPassword', {
                rules: [{
                  required: true,
                  message: '请再次输入密码',
                  whitespace: true,
                }, { validator: this.compareToFirstPassword }],
              })(
                <Input type="password" onBlur={this.handleConfirmBlur} />,
              )}
            </FormItem>
          </div>
        </Modal>
      </Layout>
    )
  }
}

export default BasicLayout