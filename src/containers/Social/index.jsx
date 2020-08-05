import React, { Fragment } from 'react';
import Emoji from 'components/Emoji'
import './style.css';

function App() {
  return (
    <Fragment>
      <header className="App--Header">
        <h1 className="App--Title">
          <Emoji symbol="🔗" /> Social
        </h1>
        <p className="App-Links App-Links--vertical">
          <a rel="noopener noreferrer" href="https://github.com/jeancarlos">* GitHub</a>
          <a rel="noopener noreferrer" href="https://www.linkedin.com/in/jeancarlosudi/">* LinkedIn</a>
          <a rel="noopener noreferrer" href="https://twitter.com/jeancarlos">* Twitter</a>
          <a rel="noopener noreferrer" href="https://www.instagram.com/jeancosouza/">* Instagram</a>
          <a rel="noopener noreferrer" href="https://open.spotify.com/user/jeancosouza?si=kg5mgm-YSjC-F9CHv3DhiA">* Spotify</a>
        </p>
      </header>
    </Fragment>
  );
}

export default App;
