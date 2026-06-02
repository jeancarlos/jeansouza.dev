import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './index'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('renders as anchor when href provided', () => {
    render(<Button href="https://example.com">Link</Button>)
    const el = screen.getByRole('link')
    expect(el).toHaveAttribute('href', 'https://example.com')
  })

  it('renders as button when no href', () => {
    render(<Button onClick={() => {}}>Action</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('applies gradient wrapper class', () => {
    const { container } = render(<Button>Test</Button>)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('rounded-full')
  })
})
