import React, { useRef, useEffect, useState } from 'react';
import emoji from 'constants/appleEmoji'

function Emoji({ label, symbol, className = '' }) {
  let parseSymbol = symbol
  const spanEl = useRef(null)
  const [fontSize, setFontSize] = useState('1rem')

  useEffect(() => {
    if (emoji[symbol] && spanEl.current) {
      setFontSize(window.getComputedStyle(spanEl.current)['font-size'])
    }
  }, [symbol]);

  if (emoji[symbol]) {
    parseSymbol = (<img style={{ width: fontSize }} alt="" src={emoji[symbol]} />)
  }

  return (
    <span
      ref={spanEl}
      className={`${className} emoji`}
      role="img"
      aria-label={label || ''}
      aria-hidden={(!!label).toString()}
    >
      {parseSymbol}
    </span>
  )
}

export default Emoji
