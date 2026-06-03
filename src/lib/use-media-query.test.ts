import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useMediaQuery } from './use-media-query'

type Listener = (e: { matches: boolean }) => void

function setupMatchMedia(initial: boolean) {
  const listeners: Listener[] = []
  const mql = {
    matches: initial,
    addEventListener: (_: string, l: Listener) => listeners.push(l),
    removeEventListener: (_: string, l: Listener) => {
      const i = listeners.indexOf(l)
      if (i >= 0) listeners.splice(i, 1)
    },
  }
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(mql))
  return { mql, listeners, setMatches: (v: boolean) => {
    mql.matches = v
    listeners.forEach(l => l({ matches: v }))
  } }
}

describe('useMediaQuery', () => {
  beforeEach(() => vi.unstubAllGlobals())

  it('returns true when query matches initially', () => {
    const { mql } = setupMatchMedia(true)
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    expect(result.current).toBe(true)
    expect(mql.addEventListener).toBeDefined()
  })

  it('returns false when query does not match initially', () => {
    setupMatchMedia(false)
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    expect(result.current).toBe(false)
  })

  it('updates on media query change', () => {
    const { setMatches } = setupMatchMedia(false)
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'))
    expect(result.current).toBe(false)
    act(() => setMatches(true))
    expect(result.current).toBe(true)
  })
})
