import { useEffect, useState } from 'react'

interface TypewriterProps {
  text: string
  className?: string
  delay?: number
}

const STAGGER_S = 0.04

/**
 * Per-character reveal, done with CSS animation-delay instead of a motion
 * library: same appearance, no runtime.
 *
 * Two accessibility properties matter here. The characters are decorative and
 * hidden, with one aria-label carrying the whole string — otherwise a screen
 * reader may announce the phrase letter by letter. And under
 * prefers-reduced-motion the text renders complete and unsplit, because
 * "animate faster" is not what the preference asks for.
 */
export function Typewriter({ text, className = '', delay = 0 }: TypewriterProps) {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (mq?.matches) setReduced(true)
  }, [])

  if (reduced) {
    return <span className={`inline-block ${className}`}>{text}</span>
  }

  return (
    <span className={`typewriter inline-block ${className}`} aria-label={text}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{ animationDelay: `${delay + i * STAGGER_S}s` }}
        >
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </span>
  )
}
