import React from 'react';

function Emoji({ label, symbol }) {
  return (
    <span
      className="emoji"
      role="img"
      aria-label={label || ''}
      aria-hidden={(!!label).toString()}
    >
      {symbol}
    </span>
  )
}

export default Emoji
