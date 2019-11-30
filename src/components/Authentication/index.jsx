import React from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'
import { getLogin } from './util'

@connect(
  () => ({}),
  {},
)
class AuthenticationRoute extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    const { component: Component, redirectPath } = this.props
    const noMatched = <Route render={() => <Redirect to={redirectPath} />} />
    const matched = <Route render={props => (<Component {...props}/>)} />
    const login = getLogin()

    console.log('login------------', login)

    return login ? matched : noMatched
  }
}

export default AuthenticationRoute
