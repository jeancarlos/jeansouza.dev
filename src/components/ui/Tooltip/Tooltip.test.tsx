import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Tooltip } from './index'

let resizeCallback: () => void = () => undefined
const disconnect = vi.fn()
const observe = vi.fn()

beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(cb: () => void) {
        resizeCallback = cb
      }
      observe = observe
      disconnect = disconnect
    }
  )
  vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(100)
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  observe.mockClear()
  disconnect.mockClear()
})

describe('Tooltip', () => {
  it('renders children in a tooltip role element', () => {
    render(<Tooltip>hello</Tooltip>)
    expect(screen.getByRole('tooltip')).toHaveTextContent('hello')
  })

  it('is scaled to zero and offset when hidden', () => {
    render(<Tooltip>hi</Tooltip>)
    expect(screen.getByRole('tooltip').style.transform).toBe('translate(-50px, 8px) scale(0)')
  })

  it('is scaled to one when shown', () => {
    render(<Tooltip show>hi</Tooltip>)
    expect(screen.getByRole('tooltip').style.transform).toBe('translate(-50px, 0) scale(1)')
  })

  it('does not shift sideways when aligned to the end', () => {
    render(
      <Tooltip show align="end">
        hi
      </Tooltip>
    )
    expect(screen.getByRole('tooltip').style.transform).toBe('translate(0px, 0) scale(1)')
  })

  it('recomputes the margin when the element resizes', () => {
    render(<Tooltip show>hi</Tooltip>)
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(200)
    resizeCallback()
    return vi.waitFor(() =>
      expect(screen.getByRole('tooltip').style.transform).toBe('translate(-100px, 0) scale(1)')
    )
  })

  it('observes the element and disconnects on unmount', () => {
    const { unmount } = render(<Tooltip>hi</Tooltip>)
    expect(observe).toHaveBeenCalledWith(screen.getByRole('tooltip'))
    unmount()
    expect(disconnect).toHaveBeenCalled()
  })

  it('calls onDismiss on click and mouse leave', () => {
    const onDismiss = vi.fn()
    render(<Tooltip onDismiss={onDismiss}>hi</Tooltip>)
    fireEvent.click(screen.getByRole('tooltip'))
    fireEvent.mouseLeave(screen.getByRole('tooltip'))
    expect(onDismiss).toHaveBeenCalledTimes(2)
  })

  it('renders as a custom component and appends className', () => {
    render(
      <Tooltip component="span" className="extra">
        hi
      </Tooltip>
    )
    const el = screen.getByRole('tooltip')
    expect(el.tagName).toBe('SPAN')
    expect(el.className).toContain('extra')
  })
})
