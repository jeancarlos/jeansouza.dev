import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Resume } from './index'
import type { TimelineEntry } from '@/content/resume/timeline'
import type { Profile } from '@/content/resume/profile'
import type { EducationEntry } from '@/content/resume/education'

const mockEntry: TimelineEntry = {
  id: 'e1',
  year: { pt: '2024', en: '2024' },
  role: { pt: 'Dev Sênior', en: 'Senior Dev' },
  company: 'ACME',
  accomplishments: [
    { tags: ['react', 'nextjs', 'typescript'], pt: 'Bullet PT 1', en: 'Bullet EN 1' },
    { tags: ['testing', 'coverage'], pt: 'Bullet PT 2', en: 'Bullet EN 2' },
    { tags: ['micro-frontends', 'ssr'], pt: 'Bullet PT 3', en: 'Bullet EN 3' },
  ],
}

const mockProfile: Profile = {
  name: 'Jean Test',
  headline: { pt: 'Dev Sênior PT', en: 'Senior Dev EN' },
  contacts: {
    email: 'test@test.dev',
    phone: '',
    linkedin: 'linkedin.com/in/test',
    github: 'github.com/test',
    website: 'test.dev',
  },
  summary: { pt: 'Resumo PT.', en: 'Summary EN.' },
  languages: { pt: 'Português (nativo)', en: 'Portuguese (native)' },
}

const mockEducation: EducationEntry[] = [
  {
    id: 'uni',
    institution: 'ESAMC',
    degree: { pt: 'Análise', en: 'Systems Analysis' },
    period: { pt: '2010 – 2012', en: '2010 – 2012' },
  },
]

describe('Resume', () => {
  it('renders header with name', () => {
    render(
      <Resume
        entries={[mockEntry]}
        profile={mockProfile}
        education={mockEducation}
        assets={[]}
        locale="pt"
      />
    )
    expect(screen.getByText('Jean Test')).toBeInTheDocument()
  })

  it('renders summary', () => {
    render(
      <Resume
        entries={[mockEntry]}
        profile={mockProfile}
        education={mockEducation}
        assets={[]}
        locale="pt"
      />
    )
    expect(screen.getByText('Resumo PT.')).toBeInTheDocument()
  })

  it('renders company name', () => {
    render(
      <Resume
        entries={[mockEntry]}
        profile={mockProfile}
        education={mockEducation}
        assets={[]}
        locale="pt"
      />
    )
    expect(screen.getByText('@ ACME')).toBeInTheDocument()
  })

  it('renders education institution', () => {
    render(
      <Resume
        entries={[mockEntry]}
        profile={mockProfile}
        education={mockEducation}
        assets={[]}
        locale="pt"
      />
    )
    expect(screen.getByText('ESAMC')).toBeInTheDocument()
  })

  it('renders languages', () => {
    render(
      <Resume
        entries={[mockEntry]}
        profile={mockProfile}
        education={mockEducation}
        assets={[]}
        locale="pt"
      />
    )
    expect(screen.getByText('Português (nativo)')).toBeInTheDocument()
  })

  it('renders in English correctly', () => {
    render(
      <Resume
        entries={[mockEntry]}
        profile={mockProfile}
        education={mockEducation}
        assets={[]}
        locale="en"
      />
    )
    expect(screen.getByText('Senior Dev EN')).toBeInTheDocument()
    expect(screen.getByText('Summary EN.')).toBeInTheDocument()
  })

  it('uses selectedSeniorFront when provided', () => {
    const entry: TimelineEntry = {
      ...mockEntry,
      selectedSeniorFront: [
        { tags: [], pt: 'selected PT', en: 'selected EN' },
        { tags: [], pt: 'selected PT 2', en: 'selected EN 2' },
        { tags: [], pt: 'selected PT 3', en: 'selected EN 3' },
      ],
    }
    render(
      <Resume
        entries={[entry]}
        profile={mockProfile}
        education={mockEducation}
        assets={[]}
        locale="pt"
      />
    )
    expect(screen.getByText('selected PT')).toBeInTheDocument()
  })

  it('dots the line into the entry where the career starts', () => {
    const { container } = render(
      <Resume
        entries={[mockEntry, { ...mockEntry, id: 'e2', careerStart: true }]}
        profile={mockProfile}
        education={mockEducation}
        assets={[]}
        locale="pt"
      />
    )
    const rows = container.querySelectorAll('ol.timeline > li')
    expect(rows[0]).toHaveAttribute('data-dotted')
    expect(rows[1]).not.toHaveAttribute('data-dotted')
  })
})
