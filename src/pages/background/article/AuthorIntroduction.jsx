import React from 'react'
// import { Icon, Avatar } from 'antd'
import Editor from '../../../components/markdown'


class AuthorIntroduction extends React.Component {
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
    const value = `> \`for-editor\` is a markdown editor

    # for-editor

    this is a markdown editor

    ## for-editor

    this is a markdown editor

    ### for-editor

    \`\`\`js
    const editor = 'for-editor'
    \`\`\`

    - item1
      - subitem1
      - subitem2
      - subitem3
    - item2
    - item3

    ---

    1. item1
    2. item2
    3. item3

    ### table

    | title | description |
    | - | - |
    | for-editor | markdown editor |


    `

    setTimeout(() => {
      this.setState({
        value
      })
    }, 200)

  }

  handleChange = value => {
    this.setState({
      value
    })
  }

  handleSave = () => {
    console.log('触发保存事件')
  }

  render() {
    const { value } = this.state

    const editorStyle = {
      boxShadow: '#999 0 0 12px',
      borderRadius: '4px'
    }

    return (
      <div style={editorStyle}>
        <Editor
          value={value}
          onChange={this.handleChange}
          onSave={this.handleSave}
        />
      </div>
    )
  }
}

export default AuthorIntroduction
