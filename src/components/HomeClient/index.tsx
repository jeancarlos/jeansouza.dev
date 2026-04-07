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
        className="relative flex flex-col items-center justify-center min-h-screen px-6 py-16 w-full"
      >
        <header className="text-center">
          <Title>
            Hi, I&apos;m <strong>Jean</strong>,{' '}
            <span className="whitespace-nowrap">Front-End Engineer</span>
            <span>.</span>
          </Title>
        </header>

        <article className="mt-6 max-w-sm text-center">
          <p className="font-body font-normal text-base leading-relaxed">
            I build fast, accessible web apps and live-code on Twitch.
            <br />
            Cats 🐱, games 🎮, tech 🧠 — and I talk way too much 🎙️.
          </p>
          <p className="font-body font-normal text-sm leading-relaxed mt-3 opacity-60">
            Find me at:
          </p>
        </article>

        <ul className="flex flex-wrap justify-center items-center gap-2 mt-8 p-0 list-none">
          <li>
            <Button href="https://twitch.tv/jeanrnk">
              <i className="fab fa-twitch mr-1" /> Live Code
            </Button>
          </li>
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
            <button
              className="text-brand-text/70 hover:text-brand-text cursor-pointer font-semibold text-sm transition-colors px-2 py-1"
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
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-brand-text/40 hover:text-brand-text/80 transition-colors cursor-pointer"
          >
            <span className="font-body font-normal text-xs tracking-widest uppercase opacity-80">
              Blog
            </span>
            <i className="fas fa-chevron-down text-lg animate-bounce" />
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
          className="w-full max-w-2xl px-6 py-20 border-t border-brand-dot/30"
        >
          <h2 className="bg-brand-gradient bg-clip-text text-transparent text-2xl font-bold mb-2">
            {post.title}
          </h2>
          <time className="block text-sm opacity-50 mb-10 font-body font-normal">
            {new Date(post.date + 'T12:00:00').toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          {/* Author-controlled markdown content — no user input, no XSS risk */}
          <div
            className="prose prose-invert prose-pink max-w-none font-body font-normal"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </article>
      ))}
    </div>
  )
}
