import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WindowHeader } from './WindowHeader'

const moveWindow = vi.fn()
const resizeWindow = vi.fn()
const closeWindow = vi.fn()
const minimizeWindow = vi.fn()
const expandWindow = vi.fn()

vi.mock('./WindowManager', () => ({
  useWindowManager: () => ({
    closeWindow,
    minimizeWindow,
    expandWindow,
    moveWindow,
    resizeWindow,
  }),
}))

function renderHeader(props: { isHome?: boolean; isExpanded?: boolean } = {}) {
  return render(
    <>
      <div role="dialog" aria-label="~/blog">
        <WindowHeader
          id="blog"
          title="~/blog"
          isHome={props.isHome ?? false}
          isExpanded={props.isExpanded ?? false}
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
  closeWindow.mockClear()
  minimizeWindow.mockClear()
  expandWindow.mockClear()
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
    expect(screen.getByRole('button', { name: 'Posição da janela' })).toHaveFocus()
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

describe('WindowHeader positions without dragging', () => {
  it('opens the positions with a pointer click and places the window', async () => {
    const user = userEvent.setup()
    renderHeader()
    const toggle = screen.getByRole('button', { name: 'Posição da janela' })
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await user.click(screen.getByRole('button', { name: 'Centro' }))
    expect(moveWindow).toHaveBeenLastCalledWith('blog', { x: 312, y: 234 })
    expect(screen.getByRole('status')).toHaveTextContent('Janela movida')
  })

  it('places each corner inside the safe margins below the topbar', async () => {
    const user = userEvent.setup()
    renderHeader()
    const toggle = screen.getByRole('button', { name: 'Posição da janela' })
    await user.click(toggle)
    await user.click(screen.getByRole('button', { name: 'Canto superior esquerdo' }))
    expect(moveWindow).toHaveBeenLastCalledWith('blog', { x: 20, y: 75 })
    await user.click(toggle)
    await user.click(screen.getByRole('button', { name: 'Canto superior direito' }))
    expect(moveWindow).toHaveBeenLastCalledWith('blog', { x: 604, y: 75 })
  })

  it('returns focus to the toggle once a position is chosen', async () => {
    const user = userEvent.setup()
    renderHeader()
    const toggle = screen.getByRole('button', { name: 'Posição da janela' })
    await user.click(toggle)
    await user.click(screen.getByRole('button', { name: 'Centro' }))
    expect(toggle).toHaveFocus()
    expect(screen.queryByRole('group', { name: 'Posição da janela' })).toBeNull()
  })

  it('closes the positions on Escape without letting Escape close the window', async () => {
    const onWindowKey = vi.fn()
    window.addEventListener('keydown', onWindowKey)
    const user = userEvent.setup()
    renderHeader()
    await user.click(screen.getByRole('button', { name: 'Posição da janela' }))
    screen.getByRole('button', { name: 'Centro' }).focus()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('group', { name: 'Posição da janela' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Posição da janela' })).toHaveFocus()
    expect(onWindowKey.mock.calls.some(([e]) => (e as KeyboardEvent).key === 'Escape')).toBe(false)
    window.removeEventListener('keydown', onWindowKey)
  })

  it('offers no positions for the home window', () => {
    renderHeader({ isHome: true })
    expect(screen.queryByRole('button', { name: 'Posição da janela' })).toBeNull()
  })
})

describe('WindowHeader traffic dots', () => {
  it('closes, minimizes and expands its own window', async () => {
    const user = userEvent.setup()
    renderHeader()
    await user.click(screen.getByRole('button', { name: 'Fechar' }))
    await user.click(screen.getByRole('button', { name: 'Minimizar' }))
    await user.click(screen.getByRole('button', { name: 'Expandir' }))
    expect(closeWindow).toHaveBeenCalledWith('blog')
    expect(minimizeWindow).toHaveBeenCalledWith('blog')
    expect(expandWindow).toHaveBeenCalledWith('blog')
  })

  it('disables all three dots on the home window', async () => {
    const user = userEvent.setup()
    renderHeader({ isHome: true })
    for (const name of ['Fechar', 'Minimizar', 'Expandir']) {
      const dot = screen.getByRole('button', { name })
      expect(dot).toBeDisabled()
      await user.click(dot)
    }
    expect(closeWindow).not.toHaveBeenCalled()
    expect(minimizeWindow).not.toHaveBeenCalled()
    expect(expandWindow).not.toHaveBeenCalled()
  })

  it('shows a static title and no grab cursor for an expanded window', () => {
    const { container } = renderHeader({ isExpanded: true })
    const handle = container.querySelector('[data-drag-handle]')
    expect(handle).not.toHaveClass('cursor-grab')
    expect(handle).toHaveTextContent('~/blog')
    expect(screen.queryByRole('button', { name: 'Posição da janela' })).toBeNull()
  })

  it('offers a grab cursor on a movable window', () => {
    const { container } = renderHeader()
    expect(container.querySelector('[data-drag-handle]')).toHaveClass('cursor-grab')
  })
})

describe('WindowHeader mobile header', () => {
  it('goes back in history from the back button', async () => {
    const back = vi.spyOn(history, 'back').mockImplementation(() => undefined)
    renderHeader()
    await userEvent.click(screen.getByRole('button', { name: 'Voltar' }))
    expect(back).toHaveBeenCalledTimes(1)
    expect(screen.getByText('< voltar')).toBeInTheDocument()
  })

  it('has no back button on the home window', () => {
    renderHeader({ isHome: true })
    expect(screen.queryByRole('button', { name: 'Voltar' })).toBeNull()
  })
})
