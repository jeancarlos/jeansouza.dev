import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { TimelineRail } from './TimelineRail'

describe('TimelineRail', () => {
  it('renders one element with aria-hidden', () => {
    const { container: c } = render(<TimelineRail />)
    const el = c.firstChild as HTMLElement
    expect(el).toBeTruthy()
    expect(el.getAttribute('aria-hidden')).toBe('true')
  })

  it('includes container query class for centering', () => {
    const { container: c } = render(<TimelineRail />)
    const el = c.firstChild as HTMLElement
    expect(el.className).toContain('@4xl:left-1/2')
  })

  it('includes default class for single column', () => {
    const { container: c } = render(<TimelineRail />)
    const el = c.firstChild as HTMLElement
    expect(el.className).toContain('left-[7px]')
  })
})
