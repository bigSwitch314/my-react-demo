import React from 'react'
import { withRouter } from 'react-router-dom'
import { Tabs, Radio } from 'antd'
import classnames from 'classnames'
import './index.less'

const TabPane = Tabs.TabPane
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

@withRouter
class TitleTabs extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentKey: '',
    }
    this.radios = []
    this.defaultValue = ''
  }

  componentWillMount() {
    React.Children.forEach(this.props.children, (child) => {
      const { props, key } = child
      if (!this.defaultValue) this.defaultValue = key
      this.radios.push(
        <RadioButton key={key} value={key}>
          {props.tab}
        </RadioButton>,
      )
    })
    const searchs = (this.props.location.search).split('&')[0]
    const currentKey = searchs.split('=')[1]
    if (currentKey) this.defaultValue = currentKey
  }

  onRadioChange = (e) => {
    this.setState({ currentKey: e.target.value })
    const { history, location } = this.props
    history.replace(location.pathname + `?c=${e.target.value}`)
  }

  render() {
    const tabs = []
    const { defaultValue = this.defaultValue, type } = this.props
    const currentKey = this.state.currentKey || defaultValue
    const classNames = classnames({
      titleTabs: 'titleTabs',
      'titleTabs-other': type === 'other',
    })

    React.Children.forEach(this.props.children, (child) => {
      const { props: { tab, children }, key } = child
      tabs.push(<TabPane key={key} tab={tab}>{currentKey === key ? children : null}</TabPane>)
    })
    return (
      <React.Fragment>
        <div className={classNames}>
          <RadioGroup value={currentKey} buttonStyle="solid" onChange={this.onRadioChange}>
            {this.radios}
          </RadioGroup>
        </div>
        <Tabs className="titleTabs-tab" activeKey={currentKey}>
          {tabs}
        </Tabs>
      </React.Fragment>
    )
  }
}

TitleTabs.TabPane = 'TabPane'

export default TitleTabs
