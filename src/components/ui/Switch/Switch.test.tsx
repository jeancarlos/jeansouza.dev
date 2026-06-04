import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Switch } from './index'

describe('Switch', () => {
  it('renders children', () => {
    render(
      <Switch on={false} onToggle={() => {}} aria-label="test">
        EN
      </Switch>
    )
    expect(screen.getByText('EN')).toBeInTheDocument()
  })

  it('calls onToggle when clicked', async () => {
    const onToggle = vi.fn()
    render(
      <Switch on={false} onToggle={onToggle} aria-label="toggle">
        X
      </Switch>
    )
    await userEvent.click(screen.getByRole('switch'))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('has aria-checked=false when off', () => {
    render(
      <Switch on={false} onToggle={() => {}} aria-label="off">
        X
      </Switch>
    )
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
  })

  it('has aria-checked=true when on', () => {
    render(
      <Switch on={true} onToggle={() => {}} aria-label="on">
        X
      </Switch>
    )
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })
})
