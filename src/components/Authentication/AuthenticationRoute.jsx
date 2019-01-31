import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import Authorized from './Authorized'
import { removeLogin, getLogin } from './util'
import { getMenus, getRoutes, getRoutesData } from '../../router'
import { fetchAuth } from 'modules/login'

const menuCodes1 = {
  基本设置: '001',
  业务设置: '002',
  系统设置: '003',
  日志管理: '004',
  地图管理: '014',
  组织管理: '001001',
  用户管理: '001002',
  设备管理: '001003',
  业务组织管理: '001006',
  域管理: '001007',
  服务器管理: '001008',
  角色管理: '001011',
  服务管理: '001012',
  录像管理: '002001',
  报警设置: '002002',
  电视墙配置: '002004',
  参数设置: '003001',
  管理日志: '004001',
  报警日志: '004002',
  系统日志: '004003',
}


@connect(
  () => ({}),
  { fetchAuth },
)
class AuthenticationRoute extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // permission: false,
      menuData: [],
      normalRoutes: [],
      routeMap: new Map(),
    }
  }

  componentWillMount() {
    getLogin() && this.props.fetchAuth().then(res => {
      if (res instanceof Error) {
        if (process.env.NODE_ENV !== 'production') {
          const { routeMap, routesData } = getRoutesData(menuCodes1)
          this.setState({
            menuData: getMenus('!/user', routesData),
            normalRoutes: getRoutes(/^(?!user)/, routesData),
            routeMap,
          })
          return
        }
        removeLogin()
        return
      }
      let { authorizedMenus = [] } = res.payload.data || {}
      const menuCodes = {}
      if (!authorizedMenus || authorizedMenus.length === 0) {
        authorizedMenus = []
        // window.currentUrl = this.props.location.pathname
        // removeLogin()
      }
      authorizedMenus.forEach(menu => {
        const { menuName, menuCode, childrenItems } = menu
        menuCodes[menuName] = menuCode
        childrenItems && childrenItems.forEach(childMenu => {
          menuCodes[childMenu.menuName] = childMenu.menuCode
        })
      })
      const { routeMap, routesData } = getRoutesData(menuCodes)
      this.setState({
        menuData: getMenus('!/user', routesData),
        normalRoutes: getRoutes(/^(?!user)/, routesData),
        routeMap,
      })
    })
  }

  render() {
    const { component: Component, redirectPath } = this.props
    const { menuData, normalRoutes, routeMap } = this.state
    // return permission ? 404 : render(children)
    const noMatched = <Route render={() => <Redirect to={redirectPath} />} />
    return (
      <Authorized noMatched={noMatched}>
        <Route
          render={props => (
            <Component
              {...props}
              menuData={menuData}
              normalRoutes={normalRoutes}
              routeMap={routeMap}
            />
          )}
        />
      </Authorized>
    )
  }
}

export default AuthenticationRoute
