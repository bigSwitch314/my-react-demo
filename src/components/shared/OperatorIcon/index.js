import React from 'react'
import classnames from 'classnames'
import { Icon, Tooltip, Divider } from 'antd'
import omit from 'omit.js'

const OperatorIcons = props => {
  let length = props.children.length || 1
  return React.Children.map(props.children, (child) => {
    const { title } = child.props
    length--
    const notLast = length !== 0
    const classNames = classnames({
      operator: 'operator',
      'operator-icon': 'operator-icon',
      [child.props.className]: child.props.className,
    })
    const childProps = omit(child.props, ['title', 'className'])

    return (
      <React.Fragment key={length}>
        <Tooltip title={title}>
          <Icon
            className={classNames}
            {...childProps}
          />
        </Tooltip>
        {notLast ? <Divider type="vertical" /> : null}
      </React.Fragment>
    )
  })
}

OperatorIcons.Icon = ''

export default OperatorIcons
