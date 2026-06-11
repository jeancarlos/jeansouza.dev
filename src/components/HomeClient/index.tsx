'use client'
import { useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence } from 'framer-motion'
import type { Post } from '@/lib/posts'
import type { ButtonOrigin } from '@/components/windows/WindowManager'
import { Hero } from '@/components/sections/Hero'
import { TerminalWindow } from '@/components/windows/TerminalWindow'
import { useWindowManager } from '@/components/windows/WindowManager'
import { topAnchoredPosition, TOPBAR_HEIGHT, WINDOW_MAX_HEIGHT } from '@/lib/windowUtils'

// Posts open offset from the list and a bit shorter, so the two read as
// stacked windows instead of one covering the other.
const POST_OFFSET = 40
const POST_MAX_HEIGHT = `calc(${WINDOW_MAX_HEIGHT} - 150px)`

const BlogListWindowDynamic = dynamic(
  async () => import('@/components/windows/BlogListWindow').then((m) => m.BlogListWindow),
  { ssr: false }
)

const BlogPostWindowDynamic = dynamic(
  async () => import('@/components/windows/BlogPostWindow').then((m) => m.BlogPostWindow),
  { ssr: false }
)

interface HomeClientProps {
  posts: Post[]
  locale: 'pt' | 'en'
  initialOpen?: 'blog' | 'resume' | 'more'
  initialPost?: Post
}

export function HomeClient({ posts, locale, initialOpen, initialPost }: HomeClientProps) {
  const { windows, closeWindow, openWindow } = useWindowManager()

  const openBlogPost = useCallback(
    (post: Post, origin?: ButtonOrigin) => {
      const w = 820
      openWindow({
        id: `post-${post.slug}`,
        url: `/${locale}/blog/${post.slug}`,
        title: `~/blog/${post.slug}`,
        content: (
          <BlogPostWindowDynamic title={post.title} date={post.date} content={post.content} />
        ),
        position: (() => {
          const anchor = topAnchoredPosition(w, TOPBAR_HEIGHT)
          return { x: anchor.x + POST_OFFSET, y: anchor.y + POST_OFFSET }
        })(),
        size: { width: w, height: 'auto' },
        maxHeight: POST_MAX_HEIGHT,
        defaultSize: 'medium',
        isExpanded: false,
        isMinimized: false,
        origin,
      })
    },
    [locale, openWindow]
  )

  const openBlogList = useCallback(
    (origin?: ButtonOrigin) => {
      const w = 820
      openWindow({
        id: 'blog',
        url: `/${locale}/blog`,
        title: '~/blog',
        content: <BlogListWindowDynamic posts={posts} onOpenPost={openBlogPost} />,
        position: topAnchoredPosition(w, TOPBAR_HEIGHT),
        size: { width: w, height: 'auto' },
        defaultSize: 'medium',
        isExpanded: false,
        isMinimized: false,
        origin,
      })
    },
    [locale, posts, openWindow, openBlogPost]
  )

  const mountedRef = useRef(false)
  const initialPropsRef = useRef({ locale, openBlogList, initialPost, initialOpen })
  useEffect(() => {
    initialPropsRef.current = { locale, openBlogList, initialPost, initialOpen }
  })

  useEffect(() => {
    if (mountedRef.current) return
    mountedRef.current = true
    const { locale, openBlogList, initialPost, initialOpen } = initialPropsRef.current
    if (initialPost || initialOpen === 'blog') {
      openBlogList()
    } else if (!initialOpen) {
      // resume/more deep links keep their own URL; Hero opens the window.
      history.pushState({ _appWindow: 'home' }, '', `/${locale}/`)
    }
  }, [])

  const initialPostOpenedRef = useRef(false)
  useEffect(() => {
    if (!initialPost || initialPostOpenedRef.current) return
    const hasBlog = windows.some((w) => w.id === 'blog')
    if (!hasBlog) return
    initialPostOpenedRef.current = true
    openBlogPost(initialPost)
  }, [windows, initialPost, openBlogPost])

  // Always-fresh snapshot of windows for use in event handlers.
  const windowsRef = useRef(windows)
  useEffect(() => {
    windowsRef.current = windows
  })

  // Prevents the pushState below from firing when a close was triggered by popstate.
  const popstateHandled = useRef(false)

  const prevWindowsLenRef = useRef(windows.length)
  useEffect(() => {
    const prevLen = prevWindowsLenRef.current
    prevWindowsLenRef.current = windows.length
    if (windows.length < prevLen) {
      if (popstateHandled.current) {
        // Close came from popstate (mobile back button) — history already moved back.
        popstateHandled.current = false
        return
      }
      // Close came from desktop (X button, Escape) — update URL to reflect new state.
      if (windows.length === 0) {
        history.pushState({ _appWindow: 'home' }, '', `/${locale}/`)
      } else {
        const top = windows.reduce((a, b) => (a.zIndex > b.zIndex ? a : b))
        history.pushState({ _appWindow: top.id }, '', top.url)
      }
    }
  }, [windows, locale])

  // Sync window state to browser back/forward navigation.
  useEffect(() => {
    const onPopstate = (e: PopStateEvent) => {
      const appState = e.state as { _appWindow?: string } | null
      // Ignore entries not pushed by this app — let Next.js handle those normally.
      if (!appState?._appWindow) return
      // Block Next.js router from also handling this popstate and triggering a soft nav.
      e.stopImmediatePropagation()
      const pathname = location.pathname
      const current = windowsRef.current
      // Close the topmost window whose URL no longer matches the current location.
      const sorted = [...current].sort((a, b) => b.zIndex - a.zIndex)
      const toClose = sorted.find((w) => w.url !== pathname)
      if (toClose) {
        popstateHandled.current = true
        closeWindow(toClose.id)
      }
    }
    window.addEventListener('popstate', onPopstate, { capture: true })
    return () => window.removeEventListener('popstate', onPopstate, { capture: true })
  }, [closeWindow])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || windows.length === 0) return
      const top = windows.reduce((a, b) => (a.zIndex > b.zIndex ? a : b))
      if (top.id !== 'home') closeWindow(top.id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [windows, closeWindow])

  const topZ =
    windows.length > 0 ? windows.reduce((a, b) => (a.zIndex > b.zIndex ? a : b)).zIndex : 0

  return (
    <>
      <Hero
        locale={locale}
        onOpenBlog={openBlogList}
        isFocused={windows.length === 0}
        initialOpen={initialOpen === 'resume' || initialOpen === 'more' ? initialOpen : undefined}
      />
      <AnimatePresence>
        {windows.map((win) => (
          <TerminalWindow
            key={win.id}
            id={win.id}
            url={win.url}
            title={win.title}
            position={win.position}
            size={win.size}
            maxHeight={win.maxHeight}
            isExpanded={win.isExpanded}
            isMinimized={win.isMinimized}
            zIndex={win.zIndex}
            isFocused={win.zIndex === topZ}
            origin={win.origin}
          >
            {win.content}
          </TerminalWindow>
        ))}
      </AnimatePresence>
    </>
  )
}
