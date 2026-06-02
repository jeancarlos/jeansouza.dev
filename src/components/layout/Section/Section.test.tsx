import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Section } from './index'

vi.mock('@/components/layout/SectionBackground', () => ({
  useBackground: () => ({ register: () => () => {} }),
}))

describe('Section', () => {
  it('renders children', () => {
    render(
      <Section id="test" bg="#11111b" mode="bow" dotColor="#a6e3a1">
        <p>content</p>
      </Section>
    )
    expect(screen.getByText('content')).toBeInTheDocument()
  })

  it('renders as a section element', () => {
    const { container } = render(
      <Section id="test" bg="#11111b" mode="bow" dotColor="#a6e3a1">
        <p>content</p>
      </Section>
    )
    expect(container.querySelector('section')).toBeTruthy()
  })
})
