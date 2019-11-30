/**
 * @flow
 */

import React from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import AuthenticationRoute from './components/Authentication'

import BasicLayout from './containers/BasicLayout'
import UserLayout from './containers/UserLayout'

const routers = () => (
  <Router>
    <Switch>
      <Route path={'/login'} component={UserLayout} />
      <AuthenticationRoute redirectPath={'/login'} component={BasicLayout} />
    </Switch>
  </Router>
)

export default routers
