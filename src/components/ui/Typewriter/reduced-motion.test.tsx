import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { render, screen } from '@testing-library/react'
import { Typewriter } from './index'

describe('Typewriter announcement', () => {
  it('exposes one accessible string rather than a stream of characters', () => {
    render(<Typewriter text="Senior Front-End Engineer" />)
    expect(screen.getByLabelText('Senior Front-End Engineer')).toBeInTheDocument()
  })

  it('hides the decorative per-character spans from assistive technology', () => {
    const { container } = render(<Typewriter text="abc" />)
    const spans = container.querySelectorAll('span span')
    expect(spans.length).toBe(3)
    for (const span of spans) expect(span).toHaveAttribute('aria-hidden', 'true')
  })
})

describe('Typewriter reduced motion', () => {
  // The component carries no media-query state on purpose: doing it in
  // JavaScript means a hydration mismatch or a setState inside an effect.
  // The guarantee therefore lives in CSS, and this asserts it is still there.
  it('has a prefers-reduced-motion rule that reveals the text without animating', () => {
    const css = readFileSync('src/styles/globals.css', 'utf8')
    const block = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'))
    expect(block).toContain('.typewriter > span')
    expect(block).toMatch(/opacity:\s*1/)
    expect(block).toMatch(/animation:\s*none/)
  })
})
