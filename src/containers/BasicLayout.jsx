import React from 'react'
import {Route, Link, Switch, Redirect} from 'react-router-dom'
import { Layout, Menu,  Avatar } from 'antd'
import { getRoutesData } from '../router/menu'
import { getMenus, getRoutes, getParentKey, getCurrentRoute } from '../router/utils'

import './style/BasicLayout.less'

const { Header, Content, Sider } = Layout

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
  导航列表: '006001',
  节点管理: '006002',
}


class BasicLayout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      menuData: [],
      getRoutes: [],
      routeMap: new Map(),
      collapsed: false,
      openkeys: '',
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.userList !== state.userList) {
      return { userList: props.userList }
    }

    return null
  }

  componentDidMount() {
    const { routeMap, routesData } = getRoutesData(menuCodes)
    const menuData = getMenus('!/user', routesData)
    const normalRoutes = getRoutes(/^(?!user)/, routesData)

    console.log(menuData)
    console.log(normalRoutes)
    this.setState({
      menuData,
      normalRoutes,
      routeMap,
    })
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

  render() {
    const { menuData, routeMap, collapsed, openkeys } = this.state
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
              <span>管理平台</span>
            </Link>
          </div>
          <div className="basic-layout-header-right">
            <span title="修改密码">
              <span className="avatar">
                <Avatar size="small"><i className="iconfont icon-user" /></Avatar>
              </span>
              <span className="name">admin</span>
            </span>
            <span title="退出"><i className="iconfont icon-logout" /></span>
          </div>
        </Header>
        <Content className="basic-layout-content">
          <Layout>
            <Sider
              width={256}
              className="basic-layout-sider"
              collapsible
              collapsed={collapsed}
              onCollapse={this.onCollapse}
            >
              <div style={{ width: 256 }}>
                <Menu
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
              <Switch>
                {/* {normalRoutes.map(routes => routes.children.length > 0 ?
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
                <Redirect to={normalRoutes[0].children[0].fullPath} /> */}
              </Switch>
            </Content>
          </Layout>
        </Content>
      </Layout>
    )
  }
}

export default BasicLayout
