/**
 * @flow
 */


import React from 'react'
import { Menu } from 'antd'
import { matchPath } from 'react-router'
import { Link } from 'react-router-dom'
import { routerConfig } from './menu'


export function getParentKey(url, configs = routerConfig) {
  const urls = url.split('/')
  let parentKey = ''
  configs.forEach(routes => {
    if (urls.indexOf(routes.path) > -1) {
      parentKey = routes.path
    }
  })
  return parentKey
}

export function getCurrentRoute(url, routes) {
  const routeKeys = Array.from(routes.keys())
  const currentKey = routeKeys.filter(path => matchPath(url, {
    path,
    exact: true,
  }))[0]
  return routes.get(currentKey) || {}
}

/**
 * 判断是否是第n级子地址
 * @param {url} 地址
 */
// export function isDeepChild(url) {
//   return routeMap.get(url) && routeMap.get(url).isDeepChild || false
// }

/**
 * 得到路由匹配的栈
 * @param {*} url
 * @param {*routes} 使用的路由
 */
export function getRouteStack(url, routes) {
  const routeStack = []
  const routeKeys = Array.from(routes.keys())
  const matchedKey = routeKeys.filter(path => matchPath(url, {
    path,
    exact: true,
  }))
  if (matchedKey.length === 0) return routeStack
  let currentRoute = routes.get(matchedKey[0])
  routeStack.push(currentRoute)
  while (currentRoute && currentRoute.parentPath) {
    currentRoute = routes.get(currentRoute.parentPath)
    routeStack.unshift(currentRoute)
  }
  return routeStack
}

export function getRoutes(path, routerData) {
  const newPath = typeof path === 'string' ? new RegExp(path) : path
  // remove the same path, root route has used  eg. has use path='/user' remove '/user'
  // Replace path to '' eg. path='user' /user/name => name
  const routes = routerData
    .filter(route => newPath.test(route.path))
    .map(item => item.path)
  // Get the route to be rendered to remove the deep rendering
  // getRenderArr(routes)
  // Conversion and stitching parameters
  const renderRoutes = routes.map(route => {
    const index = routerData.findIndex(item => item.path.indexOf(`${route}`) > -1)
    return routerData[index]
  })
  return renderRoutes
}

export function getMenus(path, routes) {
  let shoudMatch = true
  path.replace(/^\/+|\/+/g, '')
  let matchedPath = path
  if (path.indexOf('!') === 0) {
    shoudMatch = false
    matchedPath = path.substr(1)
  }
  if (shoudMatch) {
    routes = routes.filter(items => items.path === matchedPath)
  } else {
    routes = routes.filter(items => items.path !== matchedPath)
  }
  const res = routes.map(route => {
    if (!route.name) return null // 这里需要抛出警告
    if (!route.component) {
      return (
        route.children.length > 0 &&
        <Menu.SubMenu title={<span>{route.icon}<span>{route.name}</span></span>} key={route.path}>
          {route.children.map(item => (
            <Menu.Item key={item.path}>
              <Link to={item.fullPath}>{item.name}</Link>
            </Menu.Item>
          ))}
        </Menu.SubMenu>
      )
    }
    return (
      <Menu.Item key={route.path}>
        <Link to={route.fullPath}>{route.icon}<span>{route.name}</span></Link>
      </Menu.Item>
    )
  })

  return res
}
