import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { TimelineDot } from './TimelineDot'

function segments(container: HTMLElement) {
  const root = container.firstChild as HTMLElement
  const [above, , below] = Array.from(root.children) as HTMLElement[]
  return { above, below }
}

describe('TimelineDot', () => {
  it('renders solid connectors', () => {
    const { container } = render(<TimelineDot above="solid" below="solid" />)
    const { above, below } = segments(container)
    expect(above.className).toContain('border-solid')
    expect(below.className).toContain('border-solid')
  })

  it('renders dotted connector for career start', () => {
    const { container } = render(<TimelineDot above="dotted" below="none" />)
    const { above, below } = segments(container)
    expect(above.className).toContain('border-dotted')
    expect(below.className).toContain('hidden')
  })

  it('hides connector above on the first item', () => {
    const { container } = render(<TimelineDot above="none" below="solid" />)
    const { above } = segments(container)
    expect(above.className).toContain('hidden')
  })
})
