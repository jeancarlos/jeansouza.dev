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
    await userEvent.click(screen.getByRole('button'))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('uses ltr gradient when off', () => {
    const { container } = render(
      <Switch on={false} onToggle={() => {}} aria-label="off">
        X
      </Switch>
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('bg-gradient-to-r')
    expect(wrapper.className).not.toContain('bg-gradient-to-l')
  })

  it('uses rtl gradient when on', () => {
    const { container } = render(
      <Switch on={true} onToggle={() => {}} aria-label="on">
        X
      </Switch>
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('bg-gradient-to-l')
    expect(wrapper.className).not.toContain('bg-gradient-to-r')
  })
})
