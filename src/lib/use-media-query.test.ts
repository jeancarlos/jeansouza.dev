import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMediaQuery } from './use-media-query'

type MQLCallback = (e: MediaQueryListEvent) => void

function mockMatchMedia(matches: boolean) {
  const listeners: MQLCallback[] = []
  const mql = {
    matches,
    addEventListener: vi.fn((_: string, fn: MQLCallback) => listeners.push(fn)),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
    _fire: (newMatches: boolean) => {
      listeners.forEach((fn) => fn({ matches: newMatches } as MediaQueryListEvent))
    },
  }
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockReturnValue(mql),
  })
  return mql
}

describe('useMediaQuery', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns true when query matches', () => {
    mockMatchMedia(true)
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    expect(result.current).toBe(true)
  })

  it('returns false when query does not match', () => {
    mockMatchMedia(false)
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    expect(result.current).toBe(false)
  })

  it('updates when media query changes', () => {
    const mql = mockMatchMedia(false)
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    expect(result.current).toBe(false)
    act(() => mql._fire(true))
    expect(result.current).toBe(true)
  })

  it('removes event listener on unmount', () => {
    const mql = mockMatchMedia(true)
    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    unmount()
    expect(mql.removeEventListener).toHaveBeenCalled()
  })
})
