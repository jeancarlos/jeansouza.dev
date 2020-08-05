import React, { Fragment } from 'react';

function App({ history }) {
  return (
    <Fragment>
      <header className="App--Header">
        <h1 className="App--Title">
          Hi, I'm <strong>Jean</strong>, <span class="App--TitleMyRole">Front-End Engineer</span>
          <span class="App--TitlePonctuation">.</span>
        </h1>
        <p className="App-Links">
          <a rel="noopener noreferrer" href="https://github.com/jeancarlos">GitHub</a>
          <a rel="noopener noreferrer" href="https://www.linkedin.com/in/jeancarlosudi/">LinkedIn</a>
        </p>
      </header>
    </Fragment>
  );
}

export default App;
