import React from 'react'
import { connect } from 'react-redux'
import store from 'store'

// const mapStateToProps = (state) => {
//   return {
//     state: state,
//   }
// }

// const mapDispatchToProps = (dispatch) => {
//   return {
//     add: () => {
//       dispatch({ type: 'ADD_TODO', text: 'Learn about qiang' })
//     },
//   }
// }

@connect(
  state => {
    all: state
  },
  { }
)

class TransshipmentArticle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.userList !== state.userList) {
      return { userList: props.userList }
    }

    return null
  }

  componentDidMount() {
    const { all } = this.props
    console.log(all)
    console.log(store.getState())
    // ["@babel/plugin-proposal-decorators", { "legacy": true }],

    // add()

    
    console.log(all)
    console.log(store.getState())

  }

  render() {
    console.log(this.props.state)
    return (
      <div>
        转载文章
        <div onClick={this.props.add}>添加</div>
      </div>

    )
  }
}




// const Transshipment = connect(
//   mapStateToProps,
//   mapDispatchToProps,
// )(TransshipmentArticle)

export default TransshipmentArticle
