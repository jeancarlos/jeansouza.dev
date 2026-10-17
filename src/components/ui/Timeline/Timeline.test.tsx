import { render, screen } from '@testing-library/react'
import { Timeline } from './index'

describe('Timeline', () => {
  it('renders each entry in order with its date, title, meta and items', () => {
    render(
      <Timeline
        entries={[
          { date: '2026', title: 'Second', meta: 'Somewhere', items: ['did a thing'] },
          { date: '2020', title: 'First' },
        ]}
      />
    )
    const headings = screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    expect(headings).toEqual(['Second', 'First'])
    expect(screen.getByText('2026')).toBeInTheDocument()
    expect(screen.getByText('Somewhere')).toBeInTheDocument()
    expect(screen.getByText('did a thing')).toBeInTheDocument()
  })

  it('marks only dotted entries', () => {
    const { container } = render(
      <Timeline
        entries={[
          { date: 'a', title: 'A', dotted: true },
          { date: 'b', title: 'B' },
        ]}
      />
    )
    const rows = container.querySelectorAll('ol.timeline > li')
    expect(rows[0]).toHaveAttribute('data-dotted')
    expect(rows[1]).not.toHaveAttribute('data-dotted')
  })
})
