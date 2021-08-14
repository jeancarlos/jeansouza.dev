import React from 'react'
import Topbar from 'components/Topbar';
import './style.styl'

function DefaultTheme ({ children }) {
  return (
    <div className="Theme">
      <Topbar />
      <div className="Theme--WrapperContent"><div className="Theme--Content">{children}</div></div>
    </div>
  )
}

export default DefaultTheme;
