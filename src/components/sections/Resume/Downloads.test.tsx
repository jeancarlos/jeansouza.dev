import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Downloads } from './Downloads'
import type { CurriculoAsset } from '@/lib/curriculo-assets'

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

const allAssets: CurriculoAsset[] = [
  {
    locale: 'pt',
    format: 'pdf',
    filename: 'jean-souza-curriculo-pt.pdf',
    url: '/curriculo/jean-souza-curriculo-pt.pdf',
  },
  {
    locale: 'pt',
    format: 'docx',
    filename: 'jean-souza-curriculo-pt.docx',
    url: '/curriculo/jean-souza-curriculo-pt.docx',
  },
  {
    locale: 'en',
    format: 'pdf',
    filename: 'jean-souza-resume-en.pdf',
    url: '/curriculo/jean-souza-resume-en.pdf',
  },
  {
    locale: 'en',
    format: 'docx',
    filename: 'jean-souza-resume-en.docx',
    url: '/curriculo/jean-souza-resume-en.docx',
  },
]

describe('Downloads', () => {
  it('renders 2 buttons for locale pt (pdf + docx)', () => {
    render(<Downloads assets={allAssets} locale="pt" />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(2)
  })

  it('renders 2 buttons for locale en (pdf + docx)', () => {
    render(<Downloads assets={allAssets} locale="en" />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(2)
  })

  it('renders nothing when no assets match locale', () => {
    render(<Downloads assets={[]} locale="pt" />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('links have correct hrefs', () => {
    render(<Downloads assets={allAssets} locale="pt" />)
    const pdfLink = screen.getAllByRole('link')[0]
    expect(pdfLink.getAttribute('href')).toBe('/curriculo/jean-souza-curriculo-pt.pdf')
  })

  it('links have download attribute', () => {
    render(<Downloads assets={allAssets} locale="pt" />)
    screen.getAllByRole('link').forEach((link) => {
      expect(link).toHaveAttribute('download')
    })
  })
})
