import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Languages } from './Languages'

describe('Languages', () => {
  it('renders the provided string', () => {
    render(<Languages value="Português (nativo) · Inglês (C1 — EF SET)" />)
    expect(screen.getByText('Português (nativo) · Inglês (C1 — EF SET)')).toBeInTheDocument()
  })

  it('renders en value', () => {
    render(<Languages value="Portuguese (native) · English (C1 — EF SET)" />)
    expect(screen.getByText('Portuguese (native) · English (C1 — EF SET)')).toBeInTheDocument()
  })
})
