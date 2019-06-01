import React from 'react'
import { Tabs } from 'antd'
import './style/OpenSourceProject.less'

const TabPane = Tabs.TabPane;


class OpenSourceProject extends React.Component {
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

  }

  render() {
    return (
      <Tabs defaultActiveKey="1" onChange={null}>
        <TabPane tab="Tab 1" key="1">Content of Tab Pane 1</TabPane>
        <TabPane tab="Tab 2" key="2">Content of Tab Pane 2</TabPane>
      </Tabs>
    )
  }
}

export default OpenSourceProject
