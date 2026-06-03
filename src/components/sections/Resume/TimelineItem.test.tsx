import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TimelineItem } from './TimelineItem'
import type { TimelineEntry } from '@/content/resume/timeline'

vi.mock('framer-motion', () => ({
  motion: {
    li: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <li className={className} {...props}>{children}</li>
    ),
    article: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <article className={className} {...props}>{children}</article>
    ),
  },
  useReducedMotion: () => false,
}))

const mockEntry: TimelineEntry = {
  id: 'test',
  year: { pt: '2024 PT', en: '2024 EN' },
  role: { pt: 'Dev PT', en: 'Dev EN' },
  company: 'ACME',
  accomplishments: [
    { tags: ['react', 'nextjs', 'typescript'], pt: 'bullet PT 1', en: 'bullet EN 1' },
    { tags: ['testing', 'coverage', 'jest'], pt: 'bullet PT 2', en: 'bullet EN 2' },
    { tags: ['micro-frontends', 'ssr', 'ssg'], pt: 'bullet PT 3', en: 'bullet EN 3' },
  ],
}

describe('TimelineItem', () => {
  it('renders company name', () => {
    render(<TimelineItem entry={mockEntry} locale="pt" side="right" index={0} />)
    expect(screen.getByText('@ ACME')).toBeInTheDocument()
  })

  it('renders pt role when locale is pt', () => {
    render(<TimelineItem entry={mockEntry} locale="pt" side="right" index={0} />)
    expect(screen.getByText('Dev PT')).toBeInTheDocument()
  })

  it('renders en role when locale is en', () => {
    render(<TimelineItem entry={mockEntry} locale="en" side="right" index={0} />)
    expect(screen.getByText('Dev EN')).toBeInTheDocument()
  })

  it('renders 3 bullets', () => {
    render(<TimelineItem entry={mockEntry} locale="pt" side="right" index={0} />)
    const bullets = screen.getAllByRole('listitem').filter(el => el.tagName === 'LI' && el.textContent !== '')
    expect(bullets.length).toBeGreaterThanOrEqual(3)
  })

  it('applies left grid class when side is left', () => {
    const { container } = render(
      <TimelineItem entry={mockEntry} locale="pt" side="left" index={0} />
    )
    const li = container.querySelector('li')
    expect(li?.className).toContain('md:col-start-1')
  })

  it('applies right grid class when side is right', () => {
    const { container } = render(
      <TimelineItem entry={mockEntry} locale="pt" side="right" index={0} />
    )
    const li = container.querySelector('li')
    expect(li?.className).toContain('md:col-start-3')
  })

  it('uses selectedSeniorFront when provided', () => {
    const entryWithSelected: TimelineEntry = {
      ...mockEntry,
      selectedSeniorFront: [
        { tags: [], pt: 'selected PT', en: 'selected EN' },
        { tags: [], pt: 'selected PT 2', en: 'selected EN 2' },
        { tags: [], pt: 'selected PT 3', en: 'selected EN 3' },
      ],
    }
    render(<TimelineItem entry={entryWithSelected} locale="pt" side="right" index={0} />)
    expect(screen.getByText('selected PT')).toBeInTheDocument()
  })
})
