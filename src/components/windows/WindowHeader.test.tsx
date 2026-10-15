import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WindowHeader } from './WindowHeader'

const moveWindow = vi.fn()
const resizeWindow = vi.fn()

vi.mock('./WindowManager', () => ({
  useWindowManager: () => ({
    closeWindow: vi.fn(),
    minimizeWindow: vi.fn(),
    expandWindow: vi.fn(),
    moveWindow,
    resizeWindow,
  }),
}))

const dragControls = { start: vi.fn() } as unknown as Parameters<
  typeof WindowHeader
>[0]['dragControls']

function renderHeader(props: { isHome?: boolean; isExpanded?: boolean } = {}) {
  return render(
    <>
      <div role="dialog" aria-label="~/blog">
        <WindowHeader
          id="blog"
          title="~/blog"
          isHome={props.isHome ?? false}
          isExpanded={props.isExpanded ?? false}
          dragControls={dragControls}
        />
      </div>
      <button type="button">after</button>
    </>
  )
}

async function enterMoveMode() {
  const user = userEvent.setup()
  screen.getByRole('button', { name: /~\/blog/ }).focus()
  await user.keyboard('{Enter}')
  return user
}

beforeEach(() => {
  moveWindow.mockClear()
  resizeWindow.mockClear()
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    left: 100,
    top: 100,
    width: 400,
    height: 300,
  } as DOMRect)
})

describe('WindowHeader keyboard move', () => {
  it('names the title button after the visible title', () => {
    renderHeader()
    expect(screen.getByRole('button', { name: /~\/blog/ })).toHaveAttribute('aria-pressed', 'false')
  })

  it('leaves a pointer click on the title to the drag', async () => {
    renderHeader()
    await userEvent.click(screen.getByRole('button', { name: /~\/blog/ }))
    expect(screen.getByRole('status')).toHaveTextContent('')
  })

  it('enters move mode from the keyboard and announces it', async () => {
    renderHeader()
    await enterMoveMode()
    expect(screen.getByRole('button', { name: /~\/blog/ })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('status')).not.toHaveTextContent('')
  })

  it('moves with arrows and takes a bigger step with Shift', async () => {
    renderHeader()
    const user = await enterMoveMode()
    await user.keyboard('{ArrowRight}')
    expect(moveWindow).toHaveBeenLastCalledWith('blog', { x: 110, y: 100 })
    await user.keyboard('{Shift>}{ArrowDown}{/Shift}')
    expect(moveWindow).toHaveBeenLastCalledWith('blog', { x: 110, y: 150 })
  })

  it('resizes with Alt and arrows', async () => {
    renderHeader()
    const user = await enterMoveMode()
    await user.keyboard('{Alt>}{ArrowRight}{/Alt}')
    expect(resizeWindow).toHaveBeenLastCalledWith(
      'blog',
      { width: 410, height: 300 },
      { x: 100, y: 100 }
    )
  })

  it('restores the start on Escape without letting Escape close the window', async () => {
    const onWindowKey = vi.fn()
    window.addEventListener('keydown', onWindowKey)
    renderHeader()
    const user = await enterMoveMode()
    await user.keyboard('{ArrowLeft}{Escape}')
    expect(moveWindow).toHaveBeenLastCalledWith('blog', { x: 100, y: 100 })
    expect(onWindowKey.mock.calls.some(([e]) => (e as KeyboardEvent).key === 'Escape')).toBe(false)
    window.removeEventListener('keydown', onWindowKey)
  })

  it('never traps the keyboard: Tab leaves the mode and moves focus onward', async () => {
    renderHeader()
    const user = await enterMoveMode()
    await user.tab()
    expect(screen.getByRole('button', { name: 'after' })).toHaveFocus()
    expect(screen.getByRole('button', { name: /~\/blog/ })).toHaveAttribute('aria-pressed', 'false')
  })

  it('does not offer moving for the home window or an expanded one', () => {
    const { unmount } = renderHeader({ isHome: true })
    expect(screen.queryByRole('button', { name: /~\/blog/ })).toBeNull()
    unmount()
    renderHeader({ isExpanded: true })
    expect(screen.queryByRole('button', { name: /~\/blog/ })).toBeNull()
  })
})
