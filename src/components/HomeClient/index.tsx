'use client'
import { useRef, useEffect, useState } from 'react'
import type { Post } from '@/lib/posts'
import { Title } from '@/components/Title'
import { Button } from '@/components/Button'
import { SocialLinks } from '@/components/SocialLinks'

interface HomeClientProps {
  posts: Post[]
}

export function HomeClient({ posts }: HomeClientProps) {
  const [socialOpen, setSocialOpen] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const postRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    const options: IntersectionObserverInit = {
      rootMargin: '0px 0px -80% 0px',
      threshold: 0,
    }

    if (heroRef.current) {
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) history.pushState(null, '', '/')
      }, options)
      obs.observe(heroRef.current)
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
      {/* Hero */}
      <div
        ref={heroRef}
        className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 py-16"
      >
        <header className="text-center">
          <Title>
            Hi, I&apos;m <strong>Jean</strong>,{' '}
            <span className="whitespace-nowrap">Front-End Engineer</span>
            <span>.</span>
          </Title>
        </header>

        <article className="mt-6 max-w-lg text-center">
          <p className="font-body text-base font-normal leading-relaxed">
            15 years shipping web interfaces — from jQuery to React 19.
            <br />
            Most front-end devs stop at the browser. I also run the server: 50+ containers, 3 years
            of uptime 🖥️.
          </p>
          <p className="mt-3 font-body text-sm font-normal leading-relaxed opacity-60">
            Cats 🐱 · games 🎮 · too many open terminals
          </p>
        </article>

        <ul className="mb-2 mt-8 flex list-none flex-wrap items-center justify-center gap-2 p-0">
          <li>
            <Button href="https://github.com/jeancarlos">
              <i className="fab fa-github mr-1" /> GitHub
            </Button>
          </li>
          <li>
            <Button href="https://bsky.app/profile/jeansouza.dev">
              <i className="fab fa-bluesky mr-1" /> Bluesky
            </Button>
          </li>
          <li>
            <Button href="https://www.linkedin.com/in/jeancarlosudi/">
              <i className="fab fa-linkedin mr-1" /> LinkedIn
            </Button>
          </li>
          <li>
            <button
              className="cursor-pointer px-2 py-1 text-sm font-semibold text-brand-text/70 transition-colors hover:text-brand-text"
              aria-expanded={socialOpen}
              onClick={() => setSocialOpen((v) => !v)}
            >
              <span className="block whitespace-nowrap">More links</span>
              <i
                className={`fas fa-chevron-down block transition-transform duration-200 ${socialOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </li>
        </ul>

        <SocialLinks open={socialOpen} />

        {/* Scroll-to-blog arrow */}
        {posts.length > 0 && (
          <button
            onClick={() => postRefs.current[0]?.scrollIntoView({ behavior: 'smooth' })}
            aria-label="Scroll to blog"
            className="absolute bottom-10 left-1/2 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-1 text-brand-text/40 transition-colors hover:text-brand-text/80"
          >
            <span className="font-body text-xs font-normal uppercase tracking-widest opacity-80">
              Blog
            </span>
            <i className="fas fa-chevron-down animate-bounce text-lg" />
          </button>
        )}
      </div>

      {/* Blog posts — scroll inline */}
      {posts.map((post, i) => (
        <article
          key={post.slug}
          ref={(el) => {
            postRefs.current[i] = el
          }}
          className="w-full max-w-2xl border-t border-brand-dot/30 px-6 py-20"
        >
          <h2 className="mb-2 bg-brand-gradient bg-clip-text text-2xl font-bold text-transparent">
            {post.title}
          </h2>
          <time className="mb-10 block font-body text-sm font-normal opacity-50">
            {new Date(post.date + 'T12:00:00').toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {/* Author-controlled markdown content — no user input, no XSS risk */}
          <div
            className="prose prose-pink prose-invert max-w-none font-body font-normal"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </article>
      ))}
    </div>
  )
}
