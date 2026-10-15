import { useEffect } from 'react'
import type { Locale } from '@/i18n/t'
import type { Post } from '@/lib/posts'
import { Hero } from '@/components/sections/Hero'
import { TerminalWindow } from '@/components/windows/TerminalWindow'
import { topWindow, useWindowManager } from '@/components/windows/WindowManager'

interface HomeClientProps {
  locale: Locale
  posts: Post[]
  isHomePage: boolean
}

export function HomeClient({ locale, posts, isHomePage }: HomeClientProps) {
  const { windows, closeWindow } = useWindowManager()
  const top = topWindow(windows)

  useEffect(() => {
    if (!top) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeWindow(top.id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [top, closeWindow])

  return (
    <>
      <Hero locale={locale} posts={posts} isFocused={!top} isPageHeading={isHomePage} />
      {windows.map((win) => (
        <TerminalWindow
          key={win.id}
          id={win.id}
          title={win.title}
          position={win.position}
          size={win.size}
          maxHeight={win.maxHeight}
          isExpanded={win.isExpanded}
          isMinimized={win.isMinimized}
          zIndex={win.zIndex}
          isFocused={win === top}
          origin={win.origin}
        >
          {win.content}
        </TerminalWindow>
      ))}
    </>
  )
}
