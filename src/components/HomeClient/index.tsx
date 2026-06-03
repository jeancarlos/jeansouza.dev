'use client'
import { useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import type { Post } from '@/lib/posts'
import { Hero } from '@/components/sections/Hero'
import { TerminalWindow } from '@/components/windows/TerminalWindow'
import { useWindowManager } from '@/components/windows/WindowManager'

const BlogListWindowDynamic = dynamic(
  () => import('@/components/windows/BlogListWindow').then((m) => m.BlogListWindow),
  { ssr: false }
)

const BlogPostWindowDynamic = dynamic(
  () => import('@/components/windows/BlogPostWindow').then((m) => m.BlogPostWindow),
  { ssr: false }
)

const SAFE = 20

interface HomeClientProps {
  posts: Post[]
  locale: 'pt' | 'en'
  initialOpen?: 'blog'
  initialPost?: Post
}

export function HomeClient({ posts, locale, initialOpen, initialPost }: HomeClientProps) {
  const { windows, closeWindow, openWindow } = useWindowManager()

  const openBlogPost = useCallback(
    (post: Post) => {
      const w = 820
      const h = 660
      const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
      const vh = typeof window !== 'undefined' ? window.innerHeight : 800
      openWindow({
        id: `post-${post.slug}`,
        url: `/${locale}/blog/${post.slug}`,
        title: `~/blog/${post.slug}`,
        content: (
          <BlogPostWindowDynamic
            title={post.title}
            date={post.date}
            contentHtml={post.contentHtml}
          />
        ),
        position: {
          x: Math.max(SAFE, Math.min((vw - w) / 2, vw - w - SAFE)),
          y: Math.max(SAFE, Math.min((vh - h) / 2, vh - h - SAFE)),
        },
        size: { width: w, height: h },
        defaultSize: 'medium',
        isExpanded: false,
        isMinimized: false,
      })
    },
    [locale, openWindow]
  )

  const openBlogList = useCallback(() => {
    const w = 820
    const h = 620
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800
    openWindow({
      id: 'blog',
      url: `/${locale}/blog`,
      title: '~/blog',
      content: <BlogListWindowDynamic posts={posts} onOpenPost={openBlogPost} />,
      position: {
        x: Math.max(SAFE, Math.min((vw - w) / 2, vw - w - SAFE)),
        y: Math.max(SAFE, Math.min((vh - h) / 2, vh - h - SAFE)),
      },
      size: { width: w, height: h },
      defaultSize: 'medium',
      isExpanded: false,
      isMinimized: false,
    })
  }, [locale, posts, openWindow, openBlogPost])

  // Handle initial URL — open appropriate windows on first render
  const mountedRef = useRef(false)
  useEffect(() => {
    if (mountedRef.current) return
    mountedRef.current = true

    if (initialPost || initialOpen === 'blog') {
      openBlogList()
      // Post (if any) opens after blog appears in state (see effect below)
    } else {
      history.pushState(null, '', `/${locale}/`)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Open initial post after blog window appears in state
  const initialPostOpenedRef = useRef(false)
  useEffect(() => {
    if (!initialPost || initialPostOpenedRef.current) return
    const hasBlog = windows.some((w) => w.id === 'blog')
    if (!hasBlog) return
    initialPostOpenedRef.current = true
    openBlogPost(initialPost)
  }, [windows, initialPost, openBlogPost])

  // URL on close — update to topmost remaining window, or home if none
  const prevWindowsLenRef = useRef(windows.length)
  useEffect(() => {
    const prevLen = prevWindowsLenRef.current
    prevWindowsLenRef.current = windows.length
    if (windows.length < prevLen) {
      if (windows.length === 0) {
        history.pushState(null, '', `/${locale}/`)
      } else {
        const top = windows.reduce((a, b) => (a.zIndex > b.zIndex ? a : b))
        history.pushState(null, '', top.url)
      }
    }
  }, [windows, locale])

  // Escape closes topmost non-home window
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || windows.length === 0) return
      const top = windows.reduce((a, b) => (a.zIndex > b.zIndex ? a : b))
      if (top.id !== 'home') closeWindow(top.id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [windows, closeWindow])

  const topZ = windows.length > 0 ? windows.reduce((a, b) => (a.zIndex > b.zIndex ? a : b)).zIndex : 0

  return (
    <>
      <Hero locale={locale} onOpenBlog={openBlogList} isFocused={windows.length === 0} />
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
          isFocused={win.zIndex === topZ}
        >
          {win.content}
        </TerminalWindow>
      ))}
    </>
  )
}
