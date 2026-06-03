import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Education } from './Education'
import type { EducationEntry } from '@/content/resume/education'

const mockEntries: EducationEntry[] = [
  {
    id: 'uni',
    institution: 'ESAMC',
    degree: { pt: 'Análise e Desenvolvimento de Sistemas', en: 'Systems Analysis' },
    period: { pt: '2010 – 2012', en: '2010 – 2012' },
  },
  {
    id: 'cert',
    institution: 'EF SET',
    degree: { pt: 'Certificação C1', en: 'C1 Certificate' },
    period: { pt: '2023', en: '2023' },
  },
]

describe('Education', () => {
  it('renders all entries', () => {
    render(<Education entries={mockEntries} locale="pt" />)
    expect(screen.getByText('ESAMC')).toBeInTheDocument()
    expect(screen.getByText('EF SET')).toBeInTheDocument()
  })

  it('renders pt degree', () => {
    render(<Education entries={mockEntries} locale="pt" />)
    expect(screen.getByText('Análise e Desenvolvimento de Sistemas')).toBeInTheDocument()
  })

  it('renders en degree', () => {
    render(<Education entries={mockEntries} locale="en" />)
    expect(screen.getByText('Systems Analysis')).toBeInTheDocument()
  })

  it('renders period', () => {
    render(<Education entries={mockEntries} locale="pt" />)
    expect(screen.getByText(/2010 – 2012/)).toBeInTheDocument()
  })
})
