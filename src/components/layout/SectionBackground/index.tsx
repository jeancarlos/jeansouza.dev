'use client'
import { createContext, useContext, useState, useCallback, useRef } from 'react'
import { DotBackground, type DotMode } from '@/components/DotBackground'

export type SectionConfig = {
  bg: string
  mode: DotMode
  dotColor: string
}

type BackgroundContextType = {
  register: (id: string, config: SectionConfig, el: HTMLElement) => () => void
}

const BackgroundContext = createContext<BackgroundContextType>({
  register: () => () => {},
})

export function useBackground() {
  return useContext(BackgroundContext)
}

export function SectionBackground({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<SectionConfig>({
    bg: '#11111b',
    mode: 'bow',
    dotColor: '#a6e3a1',
  })
  const observers = useRef<Map<string, IntersectionObserver>>(new Map())

  const register = useCallback((id: string, config: SectionConfig, el: HTMLElement) => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(config)
      },
      { threshold: 0.4 }
    )
    obs.observe(el)
    observers.current.set(id, obs)
    return () => {
      obs.disconnect()
      observers.current.delete(id)
    }
  }, [])

  return (
    <BackgroundContext.Provider value={{ register }}>
      <div
        style={{
          backgroundColor: active.bg,
          transition: 'background-color 120ms ease',
          minHeight: '100vh',
        }}
      >
        <DotBackground mode={active.mode} color={active.dotColor} />
        {children}
      </div>
    </BackgroundContext.Provider>
  )
}
