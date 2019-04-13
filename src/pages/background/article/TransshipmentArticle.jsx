import React from 'react'
import { connect } from 'react-redux'

@connect(
  state => ({
    all: state
  })
)

class TransshipmentArticle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
    this.add = this.add.bind(this)
  }

  static getDerivedStateFromProps(props, state) {
    if (props.userList !== state.userList) {
      return { userList: props.userList }
    }

    return null
  }

  add() {
    this.props.dispatch({ type: 'ADD_TODO', text: 'Learn about qiang' })
  }

  componentDidMount() {
    // const { all } = this.props
    // console.log(all)
    // console.log(store.getState())

    console.log(this.props.all)

  }

  render() {
    console.log(this.props)
    return (
      <div>
        转载文章
        <div onClick={this.add}>添加</div>
      </div>

    )
  }
}

export default TransshipmentArticle
