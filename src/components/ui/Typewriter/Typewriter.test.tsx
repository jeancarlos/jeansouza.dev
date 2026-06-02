import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Typewriter } from './index'

describe('Typewriter', () => {
  it('renders without crashing', () => {
    const { container } = render(<Typewriter text="hello" />)
    expect(container.firstChild).toBeTruthy()
  })

  it('renders one span per character', () => {
    const { container } = render(<Typewriter text="abc" />)
    // outer motion.span + one inner span per character
    const spans = container.querySelectorAll('span span')
    expect(spans.length).toBe(3)
  })
})
