import React, { useEffect, useState } from 'react'
import '@fortawesome/fontawesome-free/js/all.js'
import Tooltip from 'components/Tooltip'
import Emoji from 'components/Emoji'
import './style.css'
import { links } from './constants'

function Social() {
  const [showTooltip, setShowTooltip] = useState([])

  const handleClick = (event, index, force) => {
    const isForceBoolean = typeof force === 'boolean'
    const forceValue = (value) => isForceBoolean ? force : value
    const newShowValue = (value, i) => index === i ? forceValue(!value) : value

    setShowTooltip(values => values.map(newShowValue))
    event.preventDefault()
  }

  useEffect(() => {
    setShowTooltip(links.map(() => false))
  }, [])


  const renderIcon = (icon) => <i className={`Social__Bullet ${icon}`}></i>

  const link = ({ name, url, content, icon = 'fas fa-link' }, index) => (
    <li key={name} className="Social__ListItem">
      {
        content ? [
          <a key="a" onClick={(e) => handleClick(e, index)} href="#pop">{renderIcon(icon)} {name}</a>,
          <Tooltip
            key="Tooltip"
            onMouseLeave={(e) => handleClick(e, index, false)}
            component='span' show={showTooltip[index]}
          >
            {content}
          </Tooltip>
        ] : <a rel="noopener noreferrer" href={url}>{renderIcon(icon)} {name}</a>
      }
    </li >
  )

  return (
    <header className="App--Header">
      <h1 className="App--Title">
        <Emoji symbol="🔗" /> Social & Links
      </h1>
      <ul className="App-Links Social__List">
        {links.map(link)}
      </ul>
    </header>
  )
}

export default Social
