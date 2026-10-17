import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { TrafficDot } from './TrafficDot'

describe('TrafficDot', () => {
  it('calls onClick without letting the click reach the window behind it', () => {
    const onClick = vi.fn()
    const outer = vi.fn()
    render(
      <div role="presentation" onClick={outer} onKeyDown={() => undefined}>
        <TrafficDot label="Close" symbol="x" color="red" onClick={onClick} />
      </div>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(outer).not.toHaveBeenCalled()
  })

  it('swallows the click when there is no handler', () => {
    const outer = vi.fn()
    render(
      <div role="presentation" onClick={outer} onKeyDown={() => undefined}>
        <TrafficDot label="Close" symbol="x" color="red" />
      </div>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Close' }))
    expect(outer).not.toHaveBeenCalled()
  })

  it('shows the symbol in the given color', () => {
    render(<TrafficDot label="Close" symbol="×" color="rgb(255, 0, 0)" />)
    const symbol = screen.getByText('×')
    expect(symbol).toHaveStyle({ backgroundColor: 'rgb(255, 0, 0)' })
    expect(symbol).toHaveAttribute('aria-hidden', 'true')
  })

  it('is disabled and dimmed when disabled', () => {
    const onClick = vi.fn()
    render(<TrafficDot label="Close" symbol="x" color="red" onClick={onClick} disabled />)
    const button = screen.getByRole('button', { name: 'Close' })
    expect(button).toBeDisabled()
    expect(button).toHaveClass('opacity-40', 'pointer-events-none')
    fireEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('is enabled by default', () => {
    render(<TrafficDot label="Close" symbol="x" color="red" />)
    expect(screen.getByRole('button', { name: 'Close' })).toBeEnabled()
  })
})
