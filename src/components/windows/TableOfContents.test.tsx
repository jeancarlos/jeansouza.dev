import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { TocDisclosure, TocSidebar } from './TableOfContents'

const headings = [
  { depth: 2 as const, slug: 'one', text: 'One' },
  { depth: 3 as const, slug: 'two', text: 'Two' },
]

afterEach(() => {
  document.body.innerHTML = ''
})

describe('table of contents', () => {
  it('indents third level headings only', () => {
    render(<TocSidebar headings={headings} />)
    expect(screen.getByText('One').closest('li')).not.toHaveClass('pl-4')
    expect(screen.getByText('Two').closest('li')).toHaveClass('pl-4')
  })

  it('scrolls to the heading instead of navigating when it exists', () => {
    const target = document.createElement('h2')
    target.id = 'one'
    const scrollIntoView = vi.fn()
    target.scrollIntoView = scrollIntoView
    document.body.append(target)
    render(<TocSidebar headings={headings} />)
    const notPrevented = fireEvent.click(screen.getByRole('link', { name: 'One' }))
    expect(notPrevented).toBe(false)
    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'start' })
  })

  it('lets the browser follow the hash when the heading is missing', () => {
    render(<TocDisclosure headings={headings} />)
    const notPrevented = fireEvent.click(screen.getByRole('link', { name: 'Two' }))
    expect(notPrevented).toBe(true)
  })

  it('labels the sidebar with the contents title', () => {
    render(<TocSidebar headings={headings} />)
    expect(screen.getByRole('navigation', { name: 'Tópicos' })).toBeInTheDocument()
  })

  it('folds the disclosure closed with the same links', () => {
    const { container } = render(<TocDisclosure headings={headings} />)
    const details = container.querySelector('details')
    expect(details).not.toHaveAttribute('open')
    expect([...container.querySelectorAll('a')].map((a) => a.getAttribute('href'))).toEqual([
      '#one',
      '#two',
    ])
  })
})
