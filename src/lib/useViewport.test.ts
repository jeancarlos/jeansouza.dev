import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

async function mountAt(width: number, height: number) {
  vi.stubGlobal('innerWidth', width)
  vi.stubGlobal('innerHeight', height)
  const { useViewport } = await import('./useViewport')
  return renderHook(() => useViewport())
}

describe('useViewport', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.unstubAllGlobals()
  })

  it('returns window dimensions initially', async () => {
    const { result } = await mountAt(1024, 768)

    expect(result.current).toEqual({ vw: 1024, vh: 768 })
  })

  it('updates when window is resized', async () => {
    const { result } = await mountAt(1024, 768)

    expect(result.current).toEqual({ vw: 1024, vh: 768 })

    vi.stubGlobal('innerWidth', 1440)
    vi.stubGlobal('innerHeight', 900)

    act(() => {
      window.dispatchEvent(new Event('resize'))
    })

    expect(result.current).toEqual({ vw: 1440, vh: 900 })
  })

  it('maintains referential stability if dimensions do not change', async () => {
    const { result } = await mountAt(1024, 768)

    const firstSnapshot = result.current

    act(() => {
      window.dispatchEvent(new Event('resize'))
    })

    const secondSnapshot = result.current
    expect(firstSnapshot).toBe(secondSnapshot)
  })
})
