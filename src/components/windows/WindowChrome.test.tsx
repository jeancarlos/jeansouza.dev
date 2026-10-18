import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
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

function grab() {
  const win = renderChrome()
  press(screen.getByText('handle'), 10, 10)
  return win
}

function dragHome() {
  press(screen.getByText('handle'), 10, 10)
  moveTo(70, 50)
  release(70, 50)
}

describe('WindowChrome drag', () => {
  it('folds a drag from the handle into the window position', () => {
    const win = grab()
    moveTo(70, 50)
    expect(win.style.translate).toBe('60px 40px')
    release(70, 50)
    expect(moveWindow).toHaveBeenCalledWith('blog', { x: 160, y: 140 })
    expect(win.style.translate).toBe('')
  })

  it('treats a press that barely moves as a click, not a drag', () => {
    const win = grab()
    moveTo(11, 11)
    release(11, 11)
    expect(moveWindow).not.toHaveBeenCalled()
    expect(win.style.translate).toBe('')
  })

  it('ends the gesture on a release outside the window, so hovering later moves nothing', () => {
    const win = grab()
    release(10, -40)
    moveTo(200, 200, { buttons: 0 })
    expect(win.style.translate).toBe('')
    expect(moveWindow).not.toHaveBeenCalled()
  })

  it('reverts instead of committing when the browser cancels the pointer', () => {
    const win = grab()
    moveTo(70, 50)
    fireEvent.pointerCancel(window, { ...P, clientX: 70, clientY: 50 })
    expect(moveWindow).not.toHaveBeenCalled()
    expect(win.style.translate).toBe('')
  })

  it('ignores a second pointer while the first one drags', () => {
    const win = grab()
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

type ChromeProps = Partial<React.ComponentProps<typeof WindowChrome>>

function chrome(props: ChromeProps = {}) {
  return (
    <WindowChrome
      id="blog"
      title="~/blog"
      isHome={false}
      isMobile={false}
      isFocused={true}
      isResizing={false}
      zIndex={20}
      activeStyle={style}
      outerClassName=""
      innerRounded=""
      draggable={true}
      {...props}
    >
      <div data-drag-handle>handle</div>
    </WindowChrome>
  )
}

describe('WindowChrome gesture guards', () => {
  it('ignores a press with a non primary button or pointer', () => {
    const win = renderChrome()
    fireEvent.pointerDown(screen.getByText('handle'), { ...P, button: 2, clientX: 10, clientY: 10 })
    moveTo(90, 90)
    fireEvent.pointerDown(screen.getByText('handle'), {
      ...P,
      isPrimary: false,
      clientX: 10,
      clientY: 10,
    })
    moveTo(90, 90)
    expect(win.style.translate).toBe('')
  })

  it('does not drag on mobile', () => {
    render(chrome({ isMobile: true }))
    const win = screen.getByRole('dialog')
    press(screen.getByText('handle'), 10, 10)
    moveTo(90, 90)
    expect(win.style.translate).toBe('')
    expect(win.className).not.toContain('max-md:hidden')
  })

  it('keeps the first gesture when a second press arrives mid drag', () => {
    const win = grab()
    press(screen.getByText('handle'), 300, 300)
    moveTo(70, 50)
    expect(win.style.translate).toBe('60px 40px')
  })

  it('reverts when a move reports no buttons held after the drag started', () => {
    const win = grab()
    moveTo(70, 50)
    moveTo(80, 60, { buttons: 0 })
    expect(win.style.translate).toBe('')
    expect(moveWindow).not.toHaveBeenCalled()
  })

  it('abandons the drag when the browser window loses focus', () => {
    const win = grab()
    moveTo(70, 50)
    fireEvent.blur(window)
    expect(win.style.translate).toBe('')
    expect(moveWindow).not.toHaveBeenCalled()
  })

  it('stops listening to the pointer when it unmounts mid drag', () => {
    const { unmount } = render(chrome())
    press(screen.getByText('handle'), 10, 10)
    const remove = vi.spyOn(window, 'removeEventListener')
    unmount()
    expect(remove).toHaveBeenCalledWith('pointermove', expect.any(Function))
    expect(remove).toHaveBeenCalledWith('pointerup', expect.any(Function))
  })

  it('does not move focus when the window is already focused', () => {
    renderChrome({ isFocused: true })
    press(screen.getByText('handle'), 10, 10)
    fireEvent.focus(screen.getByRole('button', { name: 'inside' }))
    expect(focusWindow).not.toHaveBeenCalled()
  })

  it('focuses a background window on press', () => {
    renderChrome({ isFocused: false })
    press(screen.getByText('body'), 10, 10)
    expect(focusWindow).toHaveBeenCalledWith('blog')
  })
})

describe('WindowChrome home window', () => {
  it('keeps the home window where it was dragged without asking the manager to move it', () => {
    render(chrome({ isHome: true }))
    const win = screen.getByRole('dialog')
    dragHome()
    expect(moveWindow).not.toHaveBeenCalled()
    expect(win.style.translate).toBe('60px 40px')
  })

  it('continues the next home drag from the offset left by the previous one', () => {
    render(chrome({ isHome: true }))
    const win = screen.getByRole('dialog')
    dragHome()
    press(screen.getByText('handle'), 100, 100)
    moveTo(110, 120)
    expect(win.style.translate).toBe('70px 60px')
  })

  it('returns to the previous offset when a home drag is cancelled', () => {
    render(chrome({ isHome: true }))
    const win = screen.getByRole('dialog')
    dragHome()
    press(screen.getByText('handle'), 100, 100)
    moveTo(150, 150)
    fireEvent.pointerCancel(window, { ...P, clientX: 150, clientY: 150 })
    expect(win.style.translate).toBe('60px 40px')
  })

  it('drops the offset on mobile and restores it when back on desktop', () => {
    const { rerender } = render(chrome({ isHome: true }))
    const win = screen.getByRole('dialog')
    dragHome()
    rerender(chrome({ isHome: true, isMobile: true }))
    expect(win.style.translate).toBe('')
    rerender(chrome({ isHome: true, isMobile: false }))
    expect(win.style.translate).toBe('60px 40px')
  })
})

describe('WindowChrome presentation', () => {
  it('blurs a background window on desktop but keeps it sharp on mobile', () => {
    const { rerender } = render(chrome({ isFocused: false }))
    expect(screen.getByRole('dialog').style.filter).toContain('blur(2px)')
    rerender(chrome({ isFocused: false, isMobile: true }))
    expect(screen.getByRole('dialog').style.filter).toBe('')
  })

  it('hides a background window on mobile only', () => {
    render(chrome({ isFocused: false }))
    expect(screen.getByRole('dialog')).toHaveClass('max-md:hidden')
  })

  it('caps the height of a content sized window with the given or default maximum', () => {
    const auto = { ...style, height: 'auto' }
    const { rerender } = render(chrome({ activeStyle: auto, maxHeight: '300px' }))
    expect(screen.getByRole('dialog').style.maxHeight).toBe('300px')
    rerender(chrome({ activeStyle: auto }))
    expect(screen.getByRole('dialog').style.maxHeight).toContain('100dvh')
    rerender(chrome({ activeStyle: auto, isMobile: true }))
    expect(screen.getByRole('dialog').style.maxHeight).toBe('')
  })

  it('animates in from the opener unless motion is reduced', () => {
    const animate = vi.fn()
    HTMLElement.prototype.animate = animate
    const origin = { x: 0, y: 0, width: 40, height: 30 }
    const first = render(chrome({ origin }))
    expect(animate).toHaveBeenCalledTimes(1)
    expect(animate.mock.calls[0][1]).toEqual({ duration: 200, easing: 'ease-out' })
    first.unmount()
    animate.mockClear()
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: true }))
    )
    render(chrome({ origin }))
    expect(animate).not.toHaveBeenCalled()
  })

  it('does not animate a window rendered for the page url', () => {
    const animate = vi.fn()
    HTMLElement.prototype.animate = animate
    render(chrome())
    expect(animate).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog')).toHaveClass('window-in')
  })

  it('shows the home window complete on first load, without the pop-in', () => {
    render(chrome({ id: 'home' }))
    expect(screen.getByRole('dialog')).not.toHaveClass('window-in')
  })

  it('moves instantly while resizing or dragging', () => {
    const { rerender } = render(chrome())
    expect(screen.getByRole('dialog').className).toContain('transition-[left,top,filter]')
    rerender(chrome({ isResizing: true }))
    expect(screen.getByRole('dialog').className).not.toContain('transition-[left,top,filter]')
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
})
