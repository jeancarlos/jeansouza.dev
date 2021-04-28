import React from 'react'
import './style.styl'

function Article ({ children }) {
  return (
    <article className="Article">
      {children}
    </article>
  )
}

export default Article;
