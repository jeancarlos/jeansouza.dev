import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Typewriter } from './index'

function mockReducedMotion(reduce: boolean) {
  vi.stubGlobal('matchMedia', (q: string) => ({
    matches: reduce && q.includes('prefers-reduced-motion'),
    media: q,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
  }))
}

afterEach(() => vi.unstubAllGlobals())

describe('Typewriter under reduced motion', () => {
  it('renders the complete text as a single node, not per-character spans', () => {
    mockReducedMotion(true)
    const { container } = render(<Typewriter text="Senior Front-End Engineer" />)
    expect(screen.getByText('Senior Front-End Engineer')).toBeInTheDocument()
    expect(container.querySelectorAll('span span').length).toBe(0)
  })

  it('still animates per character when no preference is expressed', () => {
    mockReducedMotion(false)
    const { container } = render(<Typewriter text="abc" />)
    expect(container.querySelectorAll('span span').length).toBe(3)
  })
})

describe('Typewriter announcement', () => {
  it('exposes one accessible string rather than a stream of characters', () => {
    mockReducedMotion(false)
    render(<Typewriter text="Senior Front-End Engineer" />)
    // The per-character spans are decorative; the label is what gets announced.
    expect(screen.getByLabelText('Senior Front-End Engineer')).toBeInTheDocument()
  })
})
