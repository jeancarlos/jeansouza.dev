import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Terminal } from './index'

describe('Terminal', () => {
  it('renders children', () => {
    render(
      <Terminal>
        <p>hello world</p>
      </Terminal>
    )
    expect(screen.getByText('hello world')).toBeInTheDocument()
  })

  it('renders exactly 3 macOS traffic-light dots', () => {
    const { container } = render(
      <Terminal>
        <p>test</p>
      </Terminal>
    )
    const dots = container.querySelectorAll('.terminal-dot')
    expect(dots.length).toBe(3)
  })
})
