'use client'
import { useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { AnimatePresence } from 'framer-motion'
import type { Post } from '@/lib/posts'
import type { ButtonOrigin } from '@/components/windows/WindowManager'
import { Hero } from '@/components/sections/Hero'
import { TerminalWindow } from '@/components/windows/TerminalWindow'
import { useWindowManager } from '@/components/windows/WindowManager'
import { centeredPosition } from '@/lib/windowUtils'

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
  initialOpen?: 'blog'
  initialPost?: Post
}

export function HomeClient({ posts, locale, initialOpen, initialPost }: HomeClientProps) {
  const { windows, closeWindow, openWindow } = useWindowManager()

  const openBlogPost = useCallback(
    (post: Post, origin?: ButtonOrigin) => {
      const w = 820
      const h = 660
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
        position: centeredPosition(w, h),
        size: { width: w, height: h },
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
      const h = 620
      openWindow({
        id: 'blog',
        url: `/${locale}/blog`,
        title: '~/blog',
        content: <BlogListWindowDynamic posts={posts} onOpenPost={openBlogPost} />,
        position: centeredPosition(w, h),
        size: { width: w, height: h },
        defaultSize: 'medium',
        isExpanded: false,
        isMinimized: false,
        origin,
      })
    },
    [locale, posts, openWindow, openBlogPost]
  )

  const mountedRef = useRef(false)
  useEffect(() => {
    if (mountedRef.current) return
    mountedRef.current = true
    if (initialPost || initialOpen === 'blog') {
      openBlogList()
    } else {
      history.pushState(null, '', `/${locale}/`)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const initialPostOpenedRef = useRef(false)
  useEffect(() => {
    if (!initialPost || initialPostOpenedRef.current) return
    const hasBlog = windows.some((w) => w.id === 'blog')
    if (!hasBlog) return
    initialPostOpenedRef.current = true
    openBlogPost(initialPost)
  }, [windows, initialPost, openBlogPost])

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
      <Hero locale={locale} onOpenBlog={openBlogList} isFocused={windows.length === 0} />
      <AnimatePresence>
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
            origin={win.origin}
          >
            {win.content}
          </TerminalWindow>
        ))}
      </AnimatePresence>
    </>
  )
}
