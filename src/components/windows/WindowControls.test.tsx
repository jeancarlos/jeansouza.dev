import { describe, expect, it } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { WindowShell } from './WindowShell'
import { STRINGS_PT } from './test-strings'

const open = () =>
  render(
    <WindowShell id="resume" label="Currículo" initialOpen strings={STRINGS_PT}>
      <p>x</p>
    </WindowShell>,
  )

describe('keyboard move and resize', () => {
  it('offers a real button to enter move mode', () => {
    open()
    expect(screen.getByRole('button', { name: /mover janela/i })).toBeInTheDocument()
  })

  it('moves with arrows and commits with Enter', async () => {
    const user = userEvent.setup()
    open()
    await user.click(screen.getByRole('button', { name: /mover janela/i }))
    await user.keyboard('{ArrowRight}{ArrowRight}{Enter}')
    expect(screen.getByTestId('window-resume')).toHaveStyle({ left: '20px' })
  })

  it('takes a bigger step with Shift', async () => {
    const user = userEvent.setup()
    open()
    await user.click(screen.getByRole('button', { name: /mover janela/i }))
    await user.keyboard('{Shift>}{ArrowRight}{/Shift}{Enter}')
    expect(screen.getByTestId('window-resume')).toHaveStyle({ left: '50px' })
  })

  it('restores the starting position on Escape', async () => {
    const user = userEvent.setup()
    open()
    const win = screen.getByTestId('window-resume')
    const before = win.style.left
    await user.click(screen.getByRole('button', { name: /mover janela/i }))
    await user.keyboard('{ArrowRight}{ArrowRight}{Escape}')
    expect(win.style.left).toBe(before)
  })

  it('never traps the keyboard — Tab still moves focus onward', async () => {
    const user = userEvent.setup()
    open()
    await user.click(screen.getByRole('button', { name: /mover janela/i }))
    const before = document.activeElement
    await user.tab()
    expect(document.activeElement).not.toBe(before)
  })

  it('provides a non-dragging pointer alternative for every drag', () => {
    open()
    // 2.5.7: each drag operation needs a single-pointer path that does not
    // require holding and moving. Presets are that path.
    expect(screen.getByRole('button', { name: /centralizar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /redefinir tamanho/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /redimensionar janela/i })).toBeInTheDocument()
  })

  it('resizes with arrows in resize mode', async () => {
    const user = userEvent.setup()
    open()
    await user.click(screen.getByRole('button', { name: /redimensionar janela/i }))
    await user.keyboard('{ArrowRight}{Enter}')
    expect(screen.getByTestId('window-resume')).toHaveStyle({ width: '650px' })
  })
})
