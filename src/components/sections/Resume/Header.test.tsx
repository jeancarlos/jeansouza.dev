import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from './Header'
import { makeProfile } from '@/test/profile'

const mockProfile = makeProfile({ headline: { pt: 'Dev Sênior PT', en: 'Senior Dev EN' } })

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
