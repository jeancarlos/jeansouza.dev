import { afterEach, describe, expect, it, vi } from 'vitest'
import { createRef } from 'react'
import { act, fireEvent, render } from '@testing-library/react'
import { WindowScrollbar } from './WindowScrollbar'
import { RESIZE_HANDLE_Z } from './ResizeHandle'

let mobile = false
vi.mock('@/lib/useIsMobile', () => ({ useIsMobile: () => mobile }))

afterEach(() => {
  mobile = false
  vi.useRealTimers()
})

function body(scrollHeight: number, clientHeight = 500) {
  const el = document.createElement('div')
  el.appendChild(document.createElement('div'))
  Object.defineProperty(el, 'scrollHeight', { value: scrollHeight })
  Object.defineProperty(el, 'clientHeight', { value: clientHeight })
  Object.defineProperty(el, 'offsetTop', { value: 38 })
  const ref = createRef<HTMLElement>()
  ;(ref as { current: HTMLElement }).current = el
  return { el, ref }
}

function mount(scrollHeight = 1000, { fakeTimers = false, mobileView = false } = {}) {
  if (fakeTimers) vi.useFakeTimers()
  mobile = mobileView
  const { el, ref } = body(scrollHeight)
  const view = render(<WindowScrollbar target={ref} />)
  const thumb = view.container.querySelector<HTMLElement>('[data-scroll-thumb]')
  if (thumb) thumb.setPointerCapture = () => {}
  return { el, ref, thumb: thumb!, label: view.container.querySelector('span')!, ...view }
}

const tick = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms)
  })

const grab = (thumb: HTMLElement, init: PointerEventInit = {}) =>
  fireEvent.pointerDown(thumb, { pointerId: 1, isPrimary: true, clientY: 10, ...init })

describe('WindowScrollbar', () => {
  it('renders nothing when the content fits', () => {
    expect(mount(500).thumb).toBeNull()
  })

  it('renders nothing without a target', () => {
    const { container } = render(<WindowScrollbar target={createRef()} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('sizes the thumb to the viewport share and labels the percent', () => {
    const { thumb, container } = mount()
    expect(thumb).toHaveStyle({ transform: 'translateY(0px)', height: '187.2px' })
    expect(container).toHaveTextContent('50%')
    expect(container.firstElementChild).toHaveStyle({ top: '54px', height: '468px' })
  })

  it('follows the scroll position', () => {
    const { el, thumb, container } = mount()
    act(() => {
      el.scrollTop = 100
      fireEvent.scroll(el)
    })
    expect(container).toHaveTextContent('60%')
    expect(thumb).toHaveStyle({ transform: 'translateY(56.16px)' })
  })

  it('scrolls the body when the thumb is dragged by its own pointer only', () => {
    const { el, thumb } = mount()
    grab(thumb)
    fireEvent.pointerMove(thumb, { pointerId: 2, clientY: 400 })
    expect(el.scrollTop).toBe(0)
    fireEvent.pointerUp(thumb, { pointerId: 2 })
    fireEvent.pointerMove(thumb, { pointerId: 1, clientY: 60 })
    expect(el.scrollTop).toBeCloseTo(89.03, 1)
    fireEvent.pointerUp(thumb, { pointerId: 1 })
    fireEvent.pointerMove(thumb, { pointerId: 1, clientY: 200 })
    expect(el.scrollTop).toBeCloseTo(89.03, 1)
  })

  it('ignores a secondary button and cancels cleanly', () => {
    const { el, thumb } = mount()
    grab(thumb, { button: 2 })
    fireEvent.pointerMove(thumb, { pointerId: 1, clientY: 60 })
    expect(el.scrollTop).toBe(0)
    grab(thumb)
    fireEvent.pointerCancel(thumb, { pointerId: 1 })
    fireEvent.pointerMove(thumb, { pointerId: 1, clientY: 60 })
    expect(el.scrollTop).toBe(0)
  })

  it('ignores a press that is not the primary pointer', () => {
    const { el, thumb } = mount()
    grab(thumb, { pointerId: 2, isPrimary: false })
    fireEvent.pointerMove(thumb, { pointerId: 2, clientY: 60 })
    expect(el.scrollTop).toBe(0)
  })

  it('stops listening when unmounted', () => {
    const { el, unmount } = mount()
    const remove = vi.spyOn(el, 'removeEventListener')
    unmount()
    expect(remove).toHaveBeenCalledWith('scroll', expect.any(Function))
  })

  it('forwards the wheel over the thumb to the body, scaling line deltas', () => {
    const { el, thumb } = mount()
    fireEvent.wheel(thumb, { deltaY: 30 })
    expect(el.scrollTop).toBe(30)
    fireEvent.wheel(thumb, { deltaY: 2, deltaMode: 1 })
    expect(el.scrollTop).toBe(62)
  })

  it('keeps the percent visible on desktop and the label out of the pointer path', () => {
    const { label } = mount()
    expect(label).toHaveClass('opacity-100')
    expect(label).toHaveClass('pointer-events-none')
    expect(label).toHaveClass('text-brand-muted')
    expect(label).not.toHaveClass('text-brand-to')
  })

  it('sits above the resize handles so the border grab wins over resizing', () => {
    const z = /\bz-(\d+)\b/.exec(mount().container.firstElementChild!.className)
    expect(Number(z?.[1])).toBeGreaterThan(RESIZE_HANDLE_Z)
  })

  describe('on mobile', () => {
    const open = () => mount(1000, { fakeTimers: true, mobileView: true })

    it('hides the percent until the page scrolls, then hides it after 2 seconds', () => {
      const { el, label } = open()
      expect(label).toHaveClass('opacity-0')
      act(() => {
        fireEvent.scroll(el)
      })
      expect(label).toHaveClass('opacity-100')
      expect(label).toHaveClass('right-full')
      tick(1999)
      expect(label).toHaveClass('opacity-100')
      tick(1)
      expect(label).toHaveClass('opacity-0')
    })

    it('shows the percent while the thumb is pressed', () => {
      const { thumb, label } = open()
      grab(thumb)
      expect(label).toHaveClass('opacity-100')
    })

    it('keeps the label up while the thumb is held and moved, and after release', () => {
      const { thumb, label } = open()
      grab(thumb)
      tick(1500)
      fireEvent.pointerMove(thumb, { pointerId: 1, clientY: 20 })
      tick(1500)
      expect(label).toHaveClass('opacity-100')
      fireEvent.pointerUp(thumb, { pointerId: 1 })
      tick(1999)
      expect(label).toHaveClass('opacity-100')
      tick(1)
      expect(label).toHaveClass('opacity-0')
    })

    it('restarts the 2 seconds on every scroll and clears the timer on unmount', () => {
      const { el, label, unmount } = open()
      act(() => {
        fireEvent.scroll(el)
        vi.advanceTimersByTime(1500)
        fireEvent.scroll(el)
        vi.advanceTimersByTime(1500)
      })
      expect(label).toHaveClass('opacity-100')
      unmount()
      expect(vi.getTimerCount()).toBe(0)
    })
  })
})
