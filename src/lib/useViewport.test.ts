import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

describe('useViewport', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.unstubAllGlobals()
  })

  it('returns window dimensions initially', async () => {
    vi.stubGlobal('innerWidth', 1024)
    vi.stubGlobal('innerHeight', 768)

    const { useViewport } = await import('./useViewport')
    const { result } = renderHook(() => useViewport())

    expect(result.current).toEqual({ vw: 1024, vh: 768 })
  })

  it('updates when window is resized', async () => {
    vi.stubGlobal('innerWidth', 1024)
    vi.stubGlobal('innerHeight', 768)

    const { useViewport } = await import('./useViewport')
    const { result } = renderHook(() => useViewport())

    expect(result.current).toEqual({ vw: 1024, vh: 768 })

    vi.stubGlobal('innerWidth', 1440)
    vi.stubGlobal('innerHeight', 900)

    act(() => {
      window.dispatchEvent(new Event('resize'))
    })

    expect(result.current).toEqual({ vw: 1440, vh: 900 })
  })

  it('maintains referential stability if dimensions do not change', async () => {
    vi.stubGlobal('innerWidth', 1024)
    vi.stubGlobal('innerHeight', 768)

    const { useViewport } = await import('./useViewport')
    const { result } = renderHook(() => useViewport())

    const firstSnapshot = result.current

    act(() => {
      window.dispatchEvent(new Event('resize'))
    })

    const secondSnapshot = result.current
    expect(firstSnapshot).toBe(secondSnapshot)
  })
})
