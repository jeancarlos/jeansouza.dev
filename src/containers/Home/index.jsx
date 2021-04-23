import React, { Fragment } from 'react'
import '@fortawesome/fontawesome-free/js/all.js'
import Button from 'components/Button'
import './style.styl'

function App({ history }) {
  return (
    <Fragment>
      <header className="App--Header">
        <h1 className="App--Title">
          Hi, I'm <strong>Jean</strong>, <span className="App--TitleMyRole">Front-End Engineer</span>
          <span className="App--TitlePonctuation">.</span>
        </h1>
        <ul className="App-Links">
          <li>
            <Button href="https://github.com/jeancarlos">
              <i className={`Social__Bullet fab fa-github`}></i> GitHub
            </Button>
          </li>
          <li>
            <Button href="https://www.linkedin.com/in/jeancarlosudi/">
              <i className={`Social__Bullet fab fa-linkedin`}></i> LinkedIn
            </Button>
          </li>
          <li>
            <Button href="https://twitter.com/jeancarlos/">
              <i className={`Social__Bullet fab fa-twitter`}></i> Twitter
            </Button>
          </li>
        </ul>
      </header>
    </Fragment>
  )
}

export default App;
