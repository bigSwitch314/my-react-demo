import React from 'react'

function renderChild(child) {
  return React.cloneElement(child, {
    className: `${child.props.className || ''} bar-item`,
  })
}

const Left = (props) => (
  <div className="header-bar-left">
    {React.Children.map(props.children, renderChild)}
  </div>
)

export default Left
