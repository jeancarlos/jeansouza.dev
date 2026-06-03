'use client'
import { useCallback, useSyncExternalStore } from 'react'

type Theme = 'dark' | 'light'
const STORAGE_KEY = 'theme'
const DEFAULT_THEME: Theme = 'dark'

const listeners = new Set<() => void>()

function read(): Theme {
  if (typeof window === 'undefined') return DEFAULT_THEME
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'light' || stored === 'dark' ? stored : DEFAULT_THEME
}

let current: Theme = read()

function subscribe(callback: () => void): () => void {
  listeners.add(callback)
  return () => {
    listeners.delete(callback)
  }
}

function getSnapshot(): Theme {
  return current
}

function getServerSnapshot(): Theme {
  return DEFAULT_THEME
}

export function setTheme(next: Theme): void {
  if (next === current) return
  current = next
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, next)
    window.document.documentElement.setAttribute('data-theme', next)
  }
  for (const l of listeners) l()
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function useThemeToggle(): () => void {
  const theme = useTheme()
  return useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme])
}
