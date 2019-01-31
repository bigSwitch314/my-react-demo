import React from 'react'

export default class Authentication extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentWillMount() {

  }

  componentDidMount() {
    this.setState({ a: 1 })
  }

  search = () => {

  }

  render() {
    return (
      <div onClick={this.search}>
        {this.state.a}
      </div>
    )
  }
}

import AuthenticationRoute from './AuthenticationRoute'

export { AuthenticationRoute }
