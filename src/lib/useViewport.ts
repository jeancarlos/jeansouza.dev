'use client'
import { useSyncExternalStore } from 'react'

export interface Viewport {
  vw: number
  vh: number
}

const DEFAULT_VIEWPORT: Viewport = { vw: 1200, vh: 800 }
const listeners = new Set<() => void>()

let cachedSnapshot: Viewport = DEFAULT_VIEWPORT

function subscribe(callback: () => void): () => void {
  listeners.add(callback)
  window.addEventListener('resize', callback)
  return () => {
    listeners.delete(callback)
    window.removeEventListener('resize', callback)
  }
}

// getSnapshot MUST return a stable reference when the values haven't
// changed — useSyncExternalStore uses Object.is to detect changes and
// would loop infinitely if we returned a new object every call.
function getSnapshot(): Viewport {
  const vw = window.innerWidth
  const vh = window.innerHeight
  if (vw === cachedSnapshot.vw && vh === cachedSnapshot.vh) return cachedSnapshot
  cachedSnapshot = { vw, vh }
  return cachedSnapshot
}

function getServerSnapshot(): Viewport {
  return DEFAULT_VIEWPORT
}

export function useViewport(): Viewport {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
