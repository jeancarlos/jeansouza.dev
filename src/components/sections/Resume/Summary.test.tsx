import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Summary } from './Summary'
import { makeProfile } from '@/test/profile'

const mockProfile = makeProfile({
  summary: { pt: 'Resumo em português aqui.', en: 'English summary here.' },
})

describe('Summary', () => {
  it('renders pt summary', () => {
    render(<Summary profile={mockProfile} locale="pt" />)
    expect(screen.getByText('Resumo em português aqui.')).toBeInTheDocument()
    expect(screen.queryByText('English summary here.')).not.toBeInTheDocument()
  })

  it('renders en summary', () => {
    render(<Summary profile={mockProfile} locale="en" />)
    expect(screen.getByText('English summary here.')).toBeInTheDocument()
    expect(screen.queryByText('Resumo em português aqui.')).not.toBeInTheDocument()
  })
})
