import { describe, it, expect, vi, afterEach } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import { useReveal } from './useReveal'

let fire: (isIntersecting: boolean) => void = () => undefined
let motionChange: () => void = () => undefined
let reduce = false

function Card() {
  const [ref, hidden] = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} data-testid="card" data-hidden={hidden}>
      card
    </div>
  )
}

function install() {
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(cb: (e: { isIntersecting: boolean }[]) => void) {
        fire = (isIntersecting) => act(() => cb([{ isIntersecting }]))
      }
      observe() {}
      disconnect() {}
    }
  )
  vi.stubGlobal('matchMedia', () => ({
    get matches() {
      return reduce
    },
    addEventListener: (_: string, cb: () => void) => (motionChange = cb),
    removeEventListener: () => undefined,
  }))
}

afterEach(() => {
  vi.unstubAllGlobals()
  reduce = false
})

describe('useReveal', () => {
  it('starts visible, so the server HTML never hides the card', () => {
    install()
    render(<Card />)
    expect(screen.getByTestId('card')).toHaveAttribute('data-hidden', 'false')
  })

  it('hides a card that starts below the fold and reveals it once it enters', () => {
    install()
    render(<Card />)
    fire(false)
    expect(screen.getByTestId('card')).toHaveAttribute('data-hidden', 'true')
    fire(true)
    expect(screen.getByTestId('card')).toHaveAttribute('data-hidden', 'false')
  })

  it('reveals at once when reduced motion is switched on mid-session', () => {
    install()
    render(<Card />)
    fire(false)
    reduce = true
    act(() => motionChange())
    expect(screen.getByTestId('card')).toHaveAttribute('data-hidden', 'false')
  })
})
