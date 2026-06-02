import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Hero } from './index'

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

vi.mock('framer-motion', () => ({
  motion: {
    span: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
      <span {...props}>{children}</span>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  steps: () => undefined,
}))

vi.mock('@/components/layout/SectionBackground', () => ({
  useBackground: () => ({ register: () => () => {} }),
}))

vi.mock('@/components/ui/SocialLinks', () => ({
  SocialLinks: () => <div data-testid="social-links" />,
}))

describe('Hero', () => {
  it('renders the terminal prompt character', () => {
    render(<Hero />)
    expect(screen.getByText('>')).toBeInTheDocument()
  })

  it('renders a CTA button', () => {
    render(<Hero />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
