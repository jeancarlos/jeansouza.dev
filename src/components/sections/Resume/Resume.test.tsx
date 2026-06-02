import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Resume } from './index'
import type { TimelineEntry } from '@/content/resume/timeline'

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  useInView: () => true,
}))

vi.mock('@/components/layout/SectionBackground', () => ({
  useBackground: () => ({ register: () => () => {} }),
}))

const mockEntries: TimelineEntry[] = [
  {
    id: 'e1',
    year: '2024',
    role: { pt: 'Dev Sênior', en: 'Senior Dev' },
    company: 'ACME',
    description: { pt: 'Descrição', en: 'Description' },
  },
]

describe('Resume', () => {
  it('renders the company name', () => {
    render(<Resume entries={mockEntries} locale="pt" />)
    expect(screen.getByText('ACME')).toBeInTheDocument()
  })

  it('renders the year', () => {
    render(<Resume entries={mockEntries} locale="pt" />)
    expect(screen.getByText(/2024/)).toBeInTheDocument()
  })

  it('renders in English when locale is en', () => {
    render(<Resume entries={mockEntries} locale="en" />)
    expect(screen.getByText('Senior Dev')).toBeInTheDocument()
  })
})
