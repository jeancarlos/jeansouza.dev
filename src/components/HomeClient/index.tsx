'use client'
import { useRef, useEffect } from 'react'
import type { Post } from '@/lib/posts'
import { Hero } from '@/components/sections/Hero'

interface HomeClientProps {
  posts: Post[]
}

export function HomeClient({ posts }: HomeClientProps) {
  const postRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    const options: IntersectionObserverInit = {
      rootMargin: '0px 0px -80% 0px',
      threshold: 0,
    }

    const heroEl = document.getElementById('hero')
    if (heroEl) {
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) history.pushState(null, '', '/')
      }, options)
      obs.observe(heroEl)
      observers.push(obs)
    }

    postRefs.current.forEach((el, i) => {
      if (!el) return
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          history.pushState(null, '', `/blog/${posts[i].slug}/`)
        }
      }, options)
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [posts])

  return (
    <div className="flex flex-col items-center">
      <Hero />

      {/* Blog posts — scroll inline */}
      {posts.map((post, i) => (
        <article
          key={post.slug}
          ref={(el) => {
            postRefs.current[i] = el
          }}
          className="border-overlay/30 w-full max-w-2xl border-t px-6 py-20"
        >
          <h2 className="mb-2 bg-[linear-gradient(to_right,var(--color-mauve),var(--color-blue))] bg-clip-text text-2xl font-bold text-transparent">
            {post.title}
          </h2>
          <time className="mb-10 block text-sm font-normal opacity-50">
            {new Date(post.date + 'T12:00:00').toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {/* Author-controlled markdown content — no user input, no XSS risk */}
          <div
            className="prose prose-pink prose-invert max-w-none font-normal"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </article>
      ))}
    </div>
  )
}
