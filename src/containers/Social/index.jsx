import React, { Fragment } from 'react';
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
  }
]

function Social() {
  return (
    <Fragment>
      <header className="App--Header">
        <h1 className="App--Title">
          <Emoji symbol="🔗" /> Social & Links
        </h1>
        <ul className="App-Links Social__List">
          {links.map(({ name, url }) => <li key={name}><span class="Social__Bullet">*</span><a rel="noopener noreferrer" href={url}> {name}</a></li>)}
        </ul>
      </header>
    </Fragment>
  );
}

export default Social;
