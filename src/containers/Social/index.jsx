import React, { useEffect, useState } from 'react';
import Tooltip from 'components/Tooltip/index'
import Emoji from 'components/Emoji'
import './style.css';

const links = [
  {
    name: 'Twitter',
    url: 'https://twitter.com/jeancarlos'
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/jeancosouza/'
  },
  {
    name: 'Spotify',
    url: 'https://open.spotify.com/user/jeancosouza'
  },
  {
    name: 'GitHub',
    url: 'https://github.com/jeancarlos'
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/jeancarlosudi/'
  },
  {
    name: 'Steam',
    url: 'https://steamcommunity.com/r/leonrk'
  },
  {
    name: 'Switch Friend Code',
    content: '1749 2384 1794'
  },
  {
    name: 'Source for this website',
    url: 'https://github.com/jeancarlos/mysite'
  }
]

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


  const link = ({ name, url, content }, index) => (
    <li key={name} className="Social__ListItem">
      <span className="Social__Bullet">*</span>
      {
        content ? [
          <a key="a" onClick={(e) => handleClick(e, index)} href="#pop"> {name}</a>,
          <Tooltip
            key="Tooltip"
            onMouseLeave={(e) => handleClick(e, index, false)}
            component='span' show={showTooltip[index]}
          >
            {content}
          </Tooltip>
        ] : <a rel="noopener noreferrer" href={url}> {name}</a>
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
  );
}

export default Social;
