'use client'
import { useEffect } from 'react'
import type { Post } from '@/lib/posts'
import { Hero } from '@/components/sections/Hero'
import { TerminalWindow } from '@/components/windows/TerminalWindow'
import { useWindowManager } from '@/components/windows/WindowManager'

interface HomeClientProps {
  posts: Post[]
  locale: 'pt' | 'en'
}

export function HomeClient({ posts, locale }: HomeClientProps) {
  const { windows, closeWindow } = useWindowManager()

  // Push home URL on mount
  useEffect(() => {
    history.pushState(null, '', `/${locale}/`)
  }, [locale])

  // Escape key closes topmost non-home window
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || windows.length === 0) return
      const top = windows.reduce((a, b) => (a.zIndex > b.zIndex ? a : b))
      if (top.id !== 'home') closeWindow(top.id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [windows, closeWindow])

  return (
    <>
      <Hero locale={locale} posts={posts} />
      {windows.map((win) => (
        <TerminalWindow
          key={win.id}
          id={win.id}
          url={win.url}
          title={win.title}
          position={win.position}
          size={win.size}
          isExpanded={win.isExpanded}
          isMinimized={win.isMinimized}
          zIndex={win.zIndex}
        >
          {win.content}
        </TerminalWindow>
      ))}
    </>
  )
}
