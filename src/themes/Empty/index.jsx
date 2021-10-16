import React from 'react'
import './style.styl'

function DefaultTheme ({ children }) {
  return (
    <div className="Theme">
      {children}
    </div>
  )
}

export default DefaultTheme
