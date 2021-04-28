import React, {useState} from 'react'
import '@fortawesome/fontawesome-free/js/all.js'
import Button from 'components/Button'
import Title from 'components/Title'
import Article from 'components/Article'
import SocialLinks from './SocialLinks'
import './style.styl'

function Home () {
  const [openSocialLinks, setOpenSocialLinks] = useState(false)
  return (
    <div className="Home">
      <header>
        <Title>
          Hi, I'm <strong>Jean</strong>, <span className="Home--TitleMyRole">Front-End Engineer</span>
          <span className="Home--TitlePonctuation">.</span>
        </Title>
      </header>
      <Article>
          <p>
            I'm a specialist in the technologies that involves the creation of websites and web applications.<br />
            I like cats 🐱, video games 🎮, exchanging ideas 💭 and I talk a lot 🎙️.
          </p>
          <p>
            Find where I'm at the links bellow:
          </p>
        </Article>
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
        <button
          className="Home--BtMore"
          onClick={() => setOpenSocialLinks(!openSocialLinks)}
        >
          <span className="Home--BtMoreText">More links</span>
          <i className="Home--BtMoreIcon fas fa-angle-double-down"></i>
        </button>
        <SocialLinks open={openSocialLinks} />
    </div>
  )
}

export default Home;
