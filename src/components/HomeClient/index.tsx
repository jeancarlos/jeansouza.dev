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
    // Fires when element enters the top 20% of the viewport
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
        className="flex flex-col items-center justify-center min-h-screen px-4 py-8 w-full"
      >
        <header className="text-center">
          <Title>
            Hi, I&apos;m <strong>Jean</strong>,{' '}
            <span className="whitespace-nowrap">Front-End Engineer</span>
            <span>.</span>
          </Title>
        </header>

        <article className="px-4 mt-4 max-w-lg text-center">
          <p className="font-body font-normal text-base leading-[1.4rem] text-justify">
            I&apos;m a specialist in the technologies for the creation of web
            applications.
            <br />
            I like cats 🐱, video games 🎮, to tinker with tech 🧠 and I talk a
            lot 🎙️.
          </p>
          <p className="font-body font-normal text-base leading-[1.4rem] mt-4">
            Find where I am at the links below:
          </p>
        </article>

        <ul className="flex flex-wrap justify-center items-center gap-x-1 gap-y-2 mt-8 p-0 list-none">
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
              className="bg-transparent border-none text-brand-text cursor-pointer block font-bold text-center w-[106px] hover:opacity-80 transition-opacity"
              onClick={() => setSocialOpen((v) => !v)}
            >
              <span className="block whitespace-nowrap">More links</span>
              <i className="fas fa-angle-double-down" />
            </button>
          </li>
        </ul>

        <SocialLinks open={socialOpen} />
      </div>

      {/* Blog posts — scroll inline */}
      {posts.map((post, i) => (
        <article
          key={post.slug}
          ref={(el) => {
            postRefs.current[i] = el
          }}
          className="w-full max-w-2xl px-6 py-16 border-t border-brand-dot/30"
        >
          <h2 className="bg-brand-gradient bg-clip-text text-transparent text-2xl font-bold mb-2">
            {post.title}
          </h2>
          <time className="block text-sm opacity-60 mb-8 font-body font-normal">
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
