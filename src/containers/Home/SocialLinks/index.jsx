import React, { useEffect, useState } from 'react'
import '@fortawesome/fontawesome-free/js/all.js'
import Tooltip from 'components/Tooltip'
import Button from 'components/Button'
import './style.styl'
import { links } from './constants'

function SocialLinks ({ open }) {
  const [showTooltip, setShowTooltip] = useState([])
  const className = open ? 'SociaLinks-open' : ''

  const handleClick = (index) =>
    setShowTooltip(values => values.map((value, i) => index === i ? !value : value))

  const handleClose = (index) => {
    setShowTooltip(values => values.map(() => false))
  }

  useEffect(() => {
    setShowTooltip(links.map(() => false))
  }, [])

  const renderIcon = (icon) => <i className={`Social__Bullet ${icon}`}></i>

  const link = ({ name, url, content, icon = 'fas fa-link' }, index) => {
    const formatedName = name.replace(/\s/g, '')

    return (
      <li key={formatedName} className="SociaLinks--ListItem">
        {
          content ? [
            <Button
              key={`${formatedName}Bt`}
              onClick={() => handleClick(index)}
              className={showTooltip[index]? 'Button-focus' : ''}
            >
              {renderIcon(icon)} {name}
            </Button>,
            <Tooltip
              key={`${formatedName}Tooltip`}
              onMouseLeave={() => handleClose(index)}
              component='span'
              show={showTooltip[index]}
            >
              {content}
            </Tooltip>
          ] : <Button rel="noopener noreferrer" href={url}>{renderIcon(icon)} {name}</Button>
        }
      </li>
    )
  }

  return (
    <ul className={`SociaLinks ${className}`}>
      {links.map(link)}
    </ul>
  )
}

export default SocialLinks
