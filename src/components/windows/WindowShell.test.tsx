import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WindowShell } from './WindowShell'
import { STRINGS_PT } from './test-strings'

describe('WindowShell', () => {
  it('renders slotted content even when the window starts closed', () => {
    render(
      <WindowShell id="post" label="Post" initialOpen={false} strings={STRINGS_PT}>
        <p>server rendered prose</p>
      </WindowShell>,
    )
    expect(screen.getByText('server rendered prose')).toBeInTheDocument()
  })

  it('exposes the role and accessible name the surface spec demands', () => {
    render(
      <WindowShell id="resume" label="Currículo" initialOpen strings={STRINGS_PT}>
        <p>x</p>
      </WindowShell>,
    )
    expect(screen.getByRole('region', { name: 'Currículo' })).toBeInTheDocument()
  })

  it('gives a scrollable body a focusable, named region', () => {
    render(
      <WindowShell id="resume" label="Currículo" initialOpen strings={STRINGS_PT}>
        <p>x</p>
      </WindowShell>,
    )
    const body = screen.getByTestId('window-body-resume')
    expect(body).toHaveAttribute('tabindex', '0')
    expect(body).toHaveAccessibleName()
  })

  it('does not make a non-scrollable body focusable', () => {
    render(
      <WindowShell id="more" label="Links" initialOpen strings={STRINGS_PT}>
        <p>x</p>
      </WindowShell>,
    )
    expect(screen.getByTestId('window-body-more')).not.toHaveAttribute('tabindex')
  })

  it('uses role=dialog only where the surface spec says so', () => {
    render(
      <WindowShell id="terminal" label="Terminal" initialOpen strings={STRINGS_PT}>
        <p>x</p>
      </WindowShell>,
    )
    expect(screen.getByRole('dialog', { name: 'Terminal' })).toBeInTheDocument()
  })
})
