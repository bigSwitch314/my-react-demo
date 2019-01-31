/**
 * @flow
 */

import React from 'react'
// import routeWapper from './components/shared/RouteWapper'

// type Props = {

// }

// type State = {
//   Module: any,
// }

export default function lazyLoad(loadComponent) {
  // @routeWapper
  class Load extends React.Component {
    state = {
      Module: null,
    }

    componentDidMount() {
      loadComponent().then(res => {
        let Module
        if (typeof res === 'function') Module = res
        else Module = res.default
        this.setState({ Module })
      }).catch(console.log)
    }

    render() {
      const { Module } = this.state
      return Module ? <Module {...this.props} /> : null
    }
  }
  return Load
}
