import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fireEvent, render } from '@testing-library/react'
import { ResizeHandle, RESIZE_DIRS, type ResizeDir } from './ResizeHandle'
import { ResizeHandles } from './ResizeHandles'
import { MIN_WINDOW_HEIGHT, MIN_WINDOW_WIDTH } from '@/lib/windowUtils'

const resizeWindow = vi.fn()
const focusWindow = vi.fn()

vi.mock('./WindowManager', () => ({
  useWindowManager: () => ({ resizeWindow, focusWindow }),
}))

const onResizeStart = vi.fn()
const onResizeEnd = vi.fn()
const setPointerCapture = vi.fn()

let frames: Map<number, FrameRequestCallback>
let nextFrame: number
const cancelFrame = vi.fn((id: number) => {
  frames.delete(id)
})

function runFrames() {
  const pending = [...frames.values()]
  frames.clear()
  for (const cb of pending) cb(0)
}

function setup(direction: ResizeDir, withDialog = true) {
  const handle = (
    <ResizeHandle
      direction={direction}
      windowId="blog"
      onResizeStart={onResizeStart}
      onResizeEnd={onResizeEnd}
    />
  )
  const view = render(withDialog ? <div role="dialog">{handle}</div> : handle)
  const el = view.container.querySelector<HTMLElement>('[data-resize-handle]')!
  return { el, ...view }
}

function press(el: Element, x: number, y: number) {
  fireEvent.pointerDown(el, { pointerId: 1, clientX: x, clientY: y })
}

function drag(el: Element, x: number, y: number) {
  fireEvent.pointerMove(el, { pointerId: 1, clientX: x, clientY: y })
}

beforeEach(() => {
  frames = new Map()
  nextFrame = 0
  vi.stubGlobal(
    'requestAnimationFrame',
    vi.fn((cb: FrameRequestCallback) => {
      nextFrame += 1
      frames.set(nextFrame, cb)
      return nextFrame
    })
  )
  vi.stubGlobal('cancelAnimationFrame', cancelFrame)
  HTMLElement.prototype.setPointerCapture = setPointerCapture
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    left: 100,
    top: 80,
    width: 400,
    height: 300,
  } as DOMRect)
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  resizeWindow.mockClear()
  focusWindow.mockClear()
  onResizeStart.mockClear()
  onResizeEnd.mockClear()
  cancelFrame.mockClear()
  setPointerCapture.mockClear()
})

describe('ResizeHandle', () => {
  it('focuses the window, captures the pointer and announces the start of a resize', () => {
    const { el } = setup('se')
    press(el, 500, 380)
    expect(focusWindow).toHaveBeenCalledWith('blog')
    expect(setPointerCapture).toHaveBeenCalledWith(1)
    expect(onResizeStart).toHaveBeenCalledTimes(1)
  })

  it('does not start a resize for a handle outside a window', () => {
    const { el } = setup('se', false)
    press(el, 500, 380)
    drag(el, 600, 480)
    runFrames()
    expect(onResizeStart).not.toHaveBeenCalled()
    expect(resizeWindow).not.toHaveBeenCalled()
  })

  it('ignores pointer movement before a press', () => {
    const { el } = setup('se')
    drag(el, 600, 480)
    runFrames()
    expect(resizeWindow).not.toHaveBeenCalled()
  })

  it('grows the bottom right corner without moving the window', () => {
    const { el } = setup('se')
    press(el, 500, 380)
    drag(el, 560, 420)
    runFrames()
    expect(resizeWindow).toHaveBeenCalledWith(
      'blog',
      { width: 460, height: 340 },
      { x: 100, y: 80 }
    )
  })

  it('grows the top left corner by shifting the window position', () => {
    const { el } = setup('nw')
    press(el, 100, 80)
    drag(el, 70, 50)
    runFrames()
    expect(resizeWindow).toHaveBeenCalledWith('blog', { width: 430, height: 330 }, { x: 70, y: 50 })
  })

  it.each([
    ['e', { width: 450, height: 300 }, { x: 100, y: 80 }],
    ['w', { width: 350, height: 300 }, { x: 150, y: 80 }],
    ['s', { width: 400, height: 350 }, { x: 100, y: 80 }],
    ['n', { width: 400, height: 250 }, { x: 100, y: 130 }],
  ] as const)('resizes along a single axis for %s', (dir, size, position) => {
    const { el } = setup(dir)
    press(el, 0, 0)
    drag(el, 50, 50)
    runFrames()
    expect(resizeWindow).toHaveBeenCalledWith('blog', size, position)
  })

  it('never shrinks the window below the minimum size', () => {
    const { el } = setup('nw')
    press(el, 0, 0)
    drag(el, 900, 900)
    runFrames()
    expect(resizeWindow).toHaveBeenCalledWith(
      'blog',
      { width: MIN_WINDOW_WIDTH, height: MIN_WINDOW_HEIGHT },
      { x: 100 + 400 - MIN_WINDOW_WIDTH, y: 80 + 300 - MIN_WINDOW_HEIGHT }
    )
  })

  it('never shrinks the bottom right corner below the minimum size', () => {
    const { el } = setup('se')
    press(el, 0, 0)
    drag(el, -900, -900)
    runFrames()
    expect(resizeWindow).toHaveBeenCalledWith(
      'blog',
      { width: MIN_WINDOW_WIDTH, height: MIN_WINDOW_HEIGHT },
      { x: 100, y: 80 }
    )
  })

  it('coalesces several moves in one frame into the latest size', () => {
    const { el } = setup('se')
    press(el, 0, 0)
    drag(el, 10, 10)
    drag(el, 20, 30)
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1)
    expect(resizeWindow).not.toHaveBeenCalled()
    runFrames()
    expect(resizeWindow).toHaveBeenCalledTimes(1)
    expect(resizeWindow).toHaveBeenCalledWith(
      'blog',
      { width: 420, height: 330 },
      { x: 100, y: 80 }
    )
  })

  it('flushes the pending size on release, cancels the frame and ends the drag', () => {
    const { el } = setup('se')
    press(el, 0, 0)
    drag(el, 10, 10)
    fireEvent.pointerUp(el, { pointerId: 1 })
    expect(cancelFrame).toHaveBeenCalledTimes(1)
    expect(resizeWindow).toHaveBeenCalledWith(
      'blog',
      { width: 410, height: 310 },
      { x: 100, y: 80 }
    )
    expect(onResizeEnd).toHaveBeenCalledTimes(1)
    resizeWindow.mockClear()
    drag(el, 200, 200)
    runFrames()
    expect(resizeWindow).not.toHaveBeenCalled()
  })

  it('ends the drag without resizing when nothing moved', () => {
    const { el } = setup('se')
    press(el, 0, 0)
    fireEvent.pointerUp(el, { pointerId: 1 })
    expect(resizeWindow).not.toHaveBeenCalled()
    expect(onResizeEnd).toHaveBeenCalledTimes(1)
  })

  it('treats a cancelled pointer like a release', () => {
    const { el } = setup('e')
    press(el, 0, 0)
    drag(el, 5, 0)
    fireEvent.pointerCancel(el, { pointerId: 1 })
    expect(resizeWindow).toHaveBeenCalledWith(
      'blog',
      { width: 405, height: 300 },
      { x: 100, y: 80 }
    )
    expect(onResizeEnd).toHaveBeenCalledTimes(1)
  })

  it('cancels a scheduled frame when it unmounts mid-drag', () => {
    const { el, unmount } = setup('se')
    press(el, 0, 0)
    drag(el, 10, 10)
    unmount()
    expect(cancelFrame).toHaveBeenCalledTimes(1)
    expect(resizeWindow).not.toHaveBeenCalled()
  })

  it('unmounts cleanly when no frame is scheduled', () => {
    const { unmount } = setup('se')
    unmount()
    expect(cancelFrame).not.toHaveBeenCalled()
  })

  it('shows the matching resize cursor and hides itself from assistive tech', () => {
    const cursors: Record<ResizeDir, string> = {
      n: 'ns-resize',
      s: 'ns-resize',
      e: 'ew-resize',
      w: 'ew-resize',
      ne: 'nesw-resize',
      sw: 'nesw-resize',
      nw: 'nwse-resize',
      se: 'nwse-resize',
    }
    for (const dir of RESIZE_DIRS) {
      const { el, unmount } = setup(dir)
      expect(el.style.cursor).toBe(cursors[dir])
      expect(el).toHaveAttribute('aria-hidden', 'true')
      unmount()
    }
  })

  it('renders one handle per edge and corner', () => {
    const { container } = render(
      <div role="dialog">
        <ResizeHandles id="blog" onResizeStart={onResizeStart} onResizeEnd={onResizeEnd} />
      </div>
    )
    expect(container.querySelectorAll('[data-resize-handle]')).toHaveLength(8)
  })
})
