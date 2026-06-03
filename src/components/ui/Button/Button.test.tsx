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

  it('applies sm padding and text size when size="sm"', () => {
    const { container } = render(<Button size="sm">X</Button>)
    const inner = container.querySelector('span') as HTMLElement
    expect(inner.className).toContain('px-2')
    expect(inner.className).toContain('py-0.5')
    expect(inner.className).toContain('text-xs')
  })

  it('applies default padding when size omitted', () => {
    const { container } = render(<Button>X</Button>)
    const inner = container.querySelector('span') as HTMLElement
    expect(inner.className).toContain('px-3')
    expect(inner.className).toContain('py-1.5')
    expect(inner.className).toContain('text-sm')
  })
})
