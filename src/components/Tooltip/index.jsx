import React, { useRef, useEffect, useState, Fragment } from 'react';
import './style.styl'

function Tooltip ({
  children,
  onMouseLeave,
  component = 'div',
  show = false,
  className = ''
}) {
  const Component = component
  const btRef = useRef(null)
  const [buttonMargin, setButtonMargin] = useState(0)
  const btStyleOpen = `scale(1) translate(-${buttonMargin}px, 0)`
  const btStyleClosed = `scale(0) translate(-${buttonMargin}px, 40px)`
  const transform = show ? btStyleOpen : btStyleClosed
  const classShow = show ? 'Tooltip-show' : ''
  const classNames = `${className} Tooltip ${classShow}`

  useEffect(() => {
    setButtonMargin(btRef.current.offsetWidth / 2)
  }, [])

  return (
      <Fragment>
        <Component
          ref={btRef}
          onClick={onMouseLeave}
          onMouseLeave={onMouseLeave}
          className={classNames}
          role="tooltip"
          style={{ transform }}
        >
          {children}
        </Component>
      </Fragment>
    )
}

export default Tooltip
