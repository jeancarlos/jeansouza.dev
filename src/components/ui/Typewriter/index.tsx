interface TypewriterProps {
  text: string
  className?: string
  delay?: number
}

const STAGGER_S = 0.04

/**
 * Per-character reveal, done with CSS animation-delay instead of a motion
 * library: same appearance, no runtime and no state.
 *
 * Reduced motion is handled entirely in CSS (see .typewriter in globals.css).
 * Doing it in JavaScript would mean either a hydration mismatch or a setState
 * inside an effect, and the media query is a styling concern anyway.
 *
 * The characters are decorative and hidden behind one aria-label, so a screen
 * reader announces the phrase once rather than letter by letter.
 */
export function Typewriter({ text, className = '', delay = 0 }: TypewriterProps) {
  return (
    <span className={`typewriter inline-block ${className}`}>
      {/*
        A bare span has no role, so it may not carry aria-label — axe flags that
        as aria-prohibited-attr. The announced copy is a visually hidden node
        instead, with the animated characters hidden from assistive technology.
      */}
      <span className="sr-only">{text}</span>
      {text.split('').map((char, i) => (
        <span key={i} aria-hidden="true" style={{ animationDelay: `${delay + i * STAGGER_S}s` }}>
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </span>
  )
}
