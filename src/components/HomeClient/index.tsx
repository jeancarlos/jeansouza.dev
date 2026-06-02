'use client'
import { useEffect } from 'react'
import type { Post } from '@/lib/posts'
import { Hero } from '@/components/sections/Hero'
import { Resume } from '@/components/sections/Resume'
import { Blog } from '@/components/sections/Blog'
import { timeline } from '@/content/resume/timeline'

interface HomeClientProps {
  posts: Post[]
  locale: 'pt' | 'en'
}

export function HomeClient({ posts, locale }: HomeClientProps) {
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    const options: IntersectionObserverInit = {
      rootMargin: '0px 0px -80% 0px',
      threshold: 0,
    }

    const heroEl = document.getElementById('hero')
    if (heroEl) {
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) history.pushState(null, '', `/${locale}/`)
      }, options)
      obs.observe(heroEl)
      observers.push(obs)
    }

    return () => observers.forEach((o) => o.disconnect())
  }, [locale])

  return (
    <div className="flex flex-col items-center">
      <Hero />

      <Resume entries={timeline} locale={locale} />

      <Blog posts={posts} />
    </div>
  )
}
