
import React from 'react'
import './style.styl'

function Button ({ children, href, onClick, className = '' }) {
  const url = href || '#'
  const rel = href ? 'noopener noreferrer' : ''

  const handleClick = (e) => {
    if (handleClick) {
      onClick()
      e.preventDefault()
    }
  }

  return (
    <a
      className={`${className} Button`}
      rel={rel}
      href={url}
      onClick={handleClick}
    >
      {children}
    </a>
  )
}

export default Button;
