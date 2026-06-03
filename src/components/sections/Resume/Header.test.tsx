import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from './Header'
import type { Profile } from '@/content/resume/profile'

const mockProfile: Profile = {
  name: 'Jean Test',
  headline: { pt: 'Dev Sênior PT', en: 'Senior Dev EN' },
  contacts: {
    email: 'test@test.dev',
    phone: '+55 34 9 0000-0000',
    linkedin: 'linkedin.com/in/test',
    github: 'github.com/test',
    website: 'test.dev',
  },
  summary: { pt: 'Resumo PT', en: 'Summary EN' },
  languages: { pt: 'Português', en: 'Portuguese' },
}

describe('Header', () => {
  it('renders name', () => {
    render(<Header profile={mockProfile} locale="pt" />)
    expect(screen.getByText('Jean Test')).toBeInTheDocument()
  })

  it('renders headline on page', () => {
    render(<Header profile={mockProfile} locale="pt" />)
    expect(screen.getByText('Dev Sênior PT')).toBeInTheDocument()
  })

  it('does not render contact info on page', () => {
    render(<Header profile={mockProfile} locale="pt" />)
    expect(screen.queryByText('test@test.dev')).not.toBeInTheDocument()
    expect(screen.queryByText('linkedin.com/in/test')).not.toBeInTheDocument()
  })
})
