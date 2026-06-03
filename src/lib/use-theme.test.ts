import { describe, it, expect, beforeEach, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useTheme, useThemeToggle, setTheme } from './use-theme'

const STORAGE_KEY = 'theme'

describe('useTheme', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
    setTheme('dark')
  })

  it('returns the current theme', () => {
    setTheme('dark')
    const { result } = renderHook(() => useTheme())
    expect(result.current).toBe('dark')
  })

  it('persists the theme to localStorage when set', () => {
    setTheme('light')
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('light')
  })

  it('sets the data-theme attribute on documentElement when set', () => {
    setTheme('light')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('notifies subscribers when theme changes', () => {
    setTheme('dark')
    const { result } = renderHook(() => useTheme())
    expect(result.current).toBe('dark')
    act(() => {
      setTheme('light')
    })
    expect(result.current).toBe('light')
  })

  it('is a no-op when setting the same theme', () => {
    setTheme('dark')
    const writeSpy = vi.spyOn(Storage.prototype, 'setItem')
    writeSpy.mockClear()
    setTheme('dark')
    expect(writeSpy).not.toHaveBeenCalled()
  })
})

describe('useThemeToggle', () => {
  beforeEach(() => {
    window.localStorage.clear()
    setTheme('dark')
  })

  it('toggles from dark to light', () => {
    setTheme('dark')
    const { result } = renderHook(() => useThemeToggle())
    act(() => {
      result.current()
    })
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('light')
  })

  it('toggles from light to dark', () => {
    setTheme('light')
    const { result } = renderHook(() => useThemeToggle())
    act(() => {
      result.current()
    })
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('dark')
  })
})
