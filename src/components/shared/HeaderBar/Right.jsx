import React from 'react'

function renderChild(child) {
  return React.cloneElement(child, {
    className: `${child.props.className} bar-item`,
  })
}

const Right = (props) => (
  <div className="header-bar-right">
    {React.Children.map(props.children, renderChild)}
  </div>
)

export default Right
