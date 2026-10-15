import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { WindowChrome } from './WindowChrome'

const moveWindow = vi.fn()
const focusWindow = vi.fn()

vi.mock('./WindowManager', () => ({
  useWindowManager: () => ({ moveWindow, focusWindow }),
}))

const style = { left: 100, top: 100, width: 400, height: 300 }

function renderChrome(props: { isHome?: boolean; draggable?: boolean; isFocused?: boolean } = {}) {
  render(
    <WindowChrome
      id="blog"
      title="~/blog"
      isHome={props.isHome ?? false}
      isMobile={false}
      isFocused={props.isFocused ?? true}
      isResizing={false}
      zIndex={20}
      activeStyle={style}
      outerClassName=""
      innerRounded=""
      draggable={props.draggable ?? true}
    >
      <div data-drag-handle>handle</div>
      <p>body</p>
      <button type="button">inside</button>
    </WindowChrome>
  )
  return screen.getByRole('dialog', { name: '~/blog' })
}

beforeEach(() => {
  HTMLElement.prototype.getAnimations = () => []
  moveWindow.mockClear()
  focusWindow.mockClear()
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    left: 160,
    top: 140,
    width: 400,
    height: 300,
  } as DOMRect)
})

const P = { pointerId: 1, isPrimary: true, button: 0, buttons: 1 }

function press(target: Element, x: number, y: number) {
  fireEvent.pointerDown(target, { ...P, clientX: x, clientY: y })
}
function moveTo(x: number, y: number, extra: object = {}) {
  fireEvent.pointerMove(window, { ...P, clientX: x, clientY: y, ...extra })
}
function release(x: number, y: number) {
  fireEvent.pointerUp(window, { ...P, buttons: 0, clientX: x, clientY: y })
}

describe('WindowChrome drag', () => {
  it('folds a drag from the handle into the window position', () => {
    const win = renderChrome()
    press(screen.getByText('handle'), 10, 10)
    moveTo(70, 50)
    expect(win.style.translate).toBe('60px 40px')
    release(70, 50)
    expect(moveWindow).toHaveBeenCalledWith('blog', { x: 160, y: 140 })
    expect(win.style.translate).toBe('')
  })

  it('treats a press that barely moves as a click, not a drag', () => {
    const win = renderChrome()
    press(screen.getByText('handle'), 10, 10)
    moveTo(11, 11)
    release(11, 11)
    expect(moveWindow).not.toHaveBeenCalled()
    expect(win.style.translate).toBe('')
  })

  it('ends the gesture on a release outside the window, so hovering later moves nothing', () => {
    const win = renderChrome()
    press(screen.getByText('handle'), 10, 10)
    release(10, -40)
    moveTo(200, 200, { buttons: 0 })
    expect(win.style.translate).toBe('')
    expect(moveWindow).not.toHaveBeenCalled()
  })

  it('reverts instead of committing when the browser cancels the pointer', () => {
    const win = renderChrome()
    press(screen.getByText('handle'), 10, 10)
    moveTo(70, 50)
    fireEvent.pointerCancel(window, { ...P, clientX: 70, clientY: 50 })
    expect(moveWindow).not.toHaveBeenCalled()
    expect(win.style.translate).toBe('')
  })

  it('ignores a second pointer while the first one drags', () => {
    const win = renderChrome()
    press(screen.getByText('handle'), 10, 10)
    moveTo(70, 50)
    fireEvent.pointerMove(window, { ...P, pointerId: 2, clientX: 500, clientY: 500 })
    fireEvent.pointerUp(window, { ...P, pointerId: 2, buttons: 0, clientX: 500, clientY: 500 })
    expect(win.style.translate).toBe('60px 40px')
    expect(moveWindow).not.toHaveBeenCalled()
  })

  it('does not drag from the window body', () => {
    const win = renderChrome()
    press(screen.getByText('body'), 10, 10)
    moveTo(90, 90)
    release(90, 90)
    expect(moveWindow).not.toHaveBeenCalled()
    expect(win.style.translate).toBe('')
  })

  it('does not drag an expanded window', () => {
    renderChrome({ draggable: false })
    press(screen.getByText('handle'), 10, 10)
    moveTo(90, 90)
    release(90, 90)
    expect(moveWindow).not.toHaveBeenCalled()
  })

  it('never claims to be modal', () => {
    expect(renderChrome()).not.toHaveAttribute('aria-modal')
  })
})

describe('WindowChrome focus', () => {
  it('brings a background window forward when keyboard focus enters it', () => {
    renderChrome({ isFocused: false })
    fireEvent.focus(screen.getByRole('button', { name: 'inside' }))
    expect(focusWindow).toHaveBeenCalledWith('blog')
  })
})
