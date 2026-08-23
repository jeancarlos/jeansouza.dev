import { describe, expect, it } from 'vitest'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { WindowStatus } from './WindowStatus'
import { WindowShell } from './WindowShell'
import { STRINGS_PT } from './test-strings'

describe('WindowStatus', () => {
  it('is a polite live region with an explicit atomic value', () => {
    render(<WindowStatus message="Modo mover." />)
    const region = screen.getByRole('status')
    expect(region).toHaveAttribute('aria-atomic', 'true')
    expect(region).toHaveTextContent('Modo mover.')
  })

  it('renders empty rather than absent so the region exists before the first message', () => {
    render(<WindowStatus message="" />)
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })
})

describe('announcements during a keyboard mode', () => {
  const open = () =>
    render(
      <WindowShell id="resume" label="Currículo" initialOpen strings={STRINGS_PT}>
        <p>x</p>
      </WindowShell>,
    )

  it('announces on entering move mode', async () => {
    const user = userEvent.setup()
    open()
    await user.click(screen.getByRole('button', { name: /mover janela/i }))
    expect(screen.getByRole('status')).toHaveTextContent(/modo mover/i)
  })

  it('does not announce on every arrow press', async () => {
    const user = userEvent.setup()
    open()
    await user.click(screen.getByRole('button', { name: /mover janela/i }))
    const afterEnter = screen.getByRole('status').textContent
    await user.keyboard('{ArrowRight}{ArrowRight}')
    expect(screen.getByRole('status').textContent).toBe(afterEnter)
  })

  it('announces the result on commit', async () => {
    const user = userEvent.setup()
    open()
    await user.click(screen.getByRole('button', { name: /mover janela/i }))
    await user.keyboard('{ArrowRight}{Enter}')
    expect(screen.getByRole('status')).toHaveTextContent(/currículo: janela movida/i)
  })

  it('announces the restore on cancel', async () => {
    const user = userEvent.setup()
    open()
    await user.click(screen.getByRole('button', { name: /mover janela/i }))
    await user.keyboard('{ArrowRight}{Escape}')
    expect(screen.getByRole('status')).toHaveTextContent(/cancelada/i)
  })
})
