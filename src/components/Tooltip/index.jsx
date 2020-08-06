import React from 'react';
import './style.css'

function Tooltip({
  children,
  onMouseLeave,
  component = 'div',
  show = false,
  className = ''
}) {
  const Component = component
  const classShow = show ? 'Tooltip--show' : ''
  const classNames = `${className} Tooltip ${classShow}`
  return (
    <Component
      onClick={onMouseLeave}
      onMouseLeave={onMouseLeave}
      className={classNames}
      role="tooltip"
    >
      {children}
    </Component>
  )
}

export default Tooltip
