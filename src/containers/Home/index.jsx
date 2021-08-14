import React, { useState } from 'react'
import { Helmet } from "react-helmet";
import '@fortawesome/fontawesome-free/js/all.js'
import Button from 'components/Button'
import Title from 'components/Title'
import SocialLinks from './SocialLinks'
import './style.styl'

function Home () {
  const [openSocialLinks, setOpenSocialLinks] = useState(false)
  return (
    <div className="Home">
      <Helmet>
        <title>Jean Souza - Front-End Engineer</title>
        <meta name="description" content="Specialist in technologies for the creation of web applications." />
        <link rel="canonical" href="https://jeansouza.dev" />
      </Helmet>
      <header>
        <Title>
          Hi, I'm <strong>Jean</strong>, <span className="Home--TitleMyRole">Front-End Engineer</span>
          <span className="Home--TitlePonctuation">.</span>
        </Title>
      </header>
      <article className="Home--Article">
        <p>
          I'm a specialist in the technologies for web applications.<br />
          I like cats 🐱, video games 🎮, to tinker with tech 🧠 and I talk a lot 🎙️.
        </p>
        <p>
          Find where I am at the links bellow:
        </p>
      </article>
      <ul className="Home--Links">
        <li>
          <Button href="https://twitch.tv/jeanrnk">
            <i className={`Social__Bullet fab fa-twitch`}></i> Live Code
          </Button>
        </li>
        <li>
          <Button href="https://github.com/jeancarlos">
            <i className={`Social__Bullet fab fa-github`}></i> GitHub
          </Button>
        </li>
        <li>
          <Button href="https://twitter.com/jeancarlos/">
            <i className={`Social__Bullet fab fa-twitter`}></i> Twitter
          </Button>
        </li>
        <li>
          <button className="Home--BtMore" onClick={() => setOpenSocialLinks(!openSocialLinks)}>
            <span className="Home--BtMoreText">More links</span>
            <i className="Home--BtMoreIcon fas fa-angle-double-down"></i>
          </button>
        </li>
      </ul>
      <SocialLinks open={openSocialLinks} />
    </div>
  )
}

export default Home;
