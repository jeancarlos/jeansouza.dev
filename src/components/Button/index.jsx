
import React, { useState } from 'react'
import './style.styl'

const hoverClass = (hover) => {
  if (typeof hover === 'undefined') {
    return ''
  }

  return hover ? 'hoverIn' : 'hoverOut'
}

function Button ({ children, href, onClick, className = '' }) {
  const url = href || '#'
  const [hoverState, setHoverState] = useState()
  const rel = href ? 'noopener noreferrer' : ''

  const handleClick = (e) => {
    if (handleClick) {
      onClick()
      e.preventDefault()
    }
  }

  return (
    <a
      className={`${className} ${hoverClass(hoverState)} Button`}
      rel={rel}
      href={url}
      onClick={handleClick}
      onFocus={() => setHoverState(true)}
      onBlur={() => setHoverState(false)}
      onMouseEnter={() => setHoverState(true)}
      onMouseLeave={() => setHoverState(false)}
    >
      {children}
    </a>
  )
}

export default Button;
