/**
 * @flow
 */

import React from 'react'
import { Route, Switch } from 'react-router-dom'
import loadComponent from '../loadComponent'

const OriginalArticle = loadComponent(() => import('../pages/article/OriginalArticle'))
const TransshipmentArticle = loadComponent(() => import('../pages/article/TransshipmentArticle'))
const AuthorIntroduction = loadComponent(() => import('../pages/article/AuthorIntroduction'))
const OpenSourceProject = loadComponent(() => import('../pages/article/OpenSourceProject'))
const CategoryManage = loadComponent(() => import('../pages/category/CategoryManage'))
const LabelManage = loadComponent(() => import('../pages/label/LabelManage'))
const UserManage = loadComponent(() => import('../pages/user/UserManage'))
const OperatorLog = loadComponent(() => import('../pages/log/OperatorLog'))
const LoginLog = loadComponent(() => import('../pages/log/LoginLog'))
const NavigationList = loadComponent(() => import('../pages/system/NavigationList'))
const NodeManage = loadComponent(() => import('../pages/system/NodeManage'))


export const routerConfig = [
  {
    name: '文章管理',
    path: 'articleManage',
    icon: <i className="iconfont icon-article" />,
    children: [
      { path: 'originalArticle', name: '原创文章', component: OriginalArticle },
      { path: 'transshipmentArticle', name: '转载文章', component: TransshipmentArticle },
    ],
  }, {
    name: '分类管理',
    path: 'categoryManage',
    icon: <i className="iconfont icon-category" />,
    component: CategoryManage,
    children: [],
  }, {
    name: '标签管理',
    path: 'labelManage',
    icon: <i className="iconfont icon-label" />,
    component: LabelManage,
    children: [],
  }, {
    name: '开源项目',
    path: 'openSourceProject',
    icon: <i className="iconfont icon-github" />,
    component: OpenSourceProject,
    children: [],
  }, {
    name: '账号管理',
    path: 'userManage',
    icon: <i className="iconfont icon-user-manage" />,
    component: UserManage,
    children: [],
  }, {
    name: '日志管理',
    path: 'logManage',
    icon: <i className="iconfont icon-log" />,
    children: [
      { path: 'operatorLog', name: '操作日志', component: OperatorLog },
      { path: 'loginLog', name: '登录日志', component: LoginLog },
    ],
  }, {
    name: '系统设置',
    path: 'systemSetting',
    icon: <i className="iconfont icon-setting" />,
    children: [
      { path: 'navigationList', name: '导航菜单', component: NavigationList },
      { path: 'nodeManage', name: '节点管理', component: NodeManage },
      { path: 'authorIntroduction', name: '个人简介', component: AuthorIntroduction },
    ],
  },
]

function createRoutesData(routerCon, auths = {}) {
  const routeMap= new Map()
  const routesData = routerCon.reduce((routers, items) => {
    const { component: Component, children = [], name } = items
    const route = {
      ...items,
      key: items.path,
      path: items.path,
      fullPath: `/${items.path}`,
      component: Component,
      name: items.name,
      children: [],
    }
    if (!auths[name]) return routers
    // $FlowFixMe children  name是可选，这里是直接定，所以报错了
    routers.push(route)
    routeMap.set(route.fullPath, {
      ...route,
      isDeepChild: false,
    })

    if (Component) {
      route.component = props => (
        <Component {...props}>
          <Switch>
            {children.map(item => (
              <Route
                key={`/${items.path}/${item.path}`}
                path={`/${items.path}/${item.path}`}
                exact
                component={item.component}
              />))}
          </Switch>
        </Component>
      )
    }

    route.children = children.filter(item => auths[item.name]).map(item => {
      const childrenPath = `${items.path}/${item.path}`
      const childRoute = {
        key: childrenPath,
        path: childrenPath,
        fullPath: `/${childrenPath}`,
        Container: item.container,
        component: item.component || null,
        name: item.name,
        children: [],
      }
      // $FlowFixMe 这里会 认为item.path为空
      const routeStack = item.path.replace(/^\/|\/$/g).split('/')
      const length = routeStack.length
      const lastPath = routeStack.pop()
      routeMap.set(childRoute.fullPath, {
        ...childRoute,
        parentPath: childRoute.fullPath.replace(`/${lastPath}`, ''),
        isDeepChild: length > 1,
      })
      return childRoute
    })
    return routers
  }, ([]))
  return { routeMap, routesData }
}

export const getRoutesData = (auths) => createRoutesData(routerConfig, auths)
