import { describe, expect, it } from 'vitest'
import { structuredData } from './structuredData'

const post = {
  slug: 'hello',
  title: 'Hello',
  date: '2026-01-01',
  description: 'A post.',
  html: '',
  cover: { src: '/c.webp', srcSet: '/c.webp 820w', alt: 'A cover.' },
  thumb: { src: '/t.webp', srcSet: '/t.webp 176w' },
  ogImage: '/og-hello.jpg',
}

describe('structuredData', () => {
  it('describes the site and its author on the home page', () => {
    const data = structuredData({ kind: 'home' }, 'en') as { '@graph': { '@type': string }[] }
    expect(data['@graph'].map((n) => n['@type'])).toEqual(['WebSite', 'Person'])
  })

  it('describes a post as a BlogPosting with its date, language and canonical URL', () => {
    expect(structuredData({ kind: 'post', post }, 'pt')).toMatchObject({
      '@type': 'BlogPosting',
      headline: 'Hello',
      datePublished: '2026-01-01',
      inLanguage: 'pt-BR',
      url: 'https://jeansouza.dev/pt/blog/hello/',
      image: 'https://jeansouza.dev/og-hello.jpg',
    })
  })

  it('marks the resume as a profile page', () => {
    expect(structuredData({ kind: 'resume' }, 'en')).toMatchObject({ '@type': 'ProfilePage' })
  })

  it('adds nothing where no schema.org type fits', () => {
    expect(structuredData({ kind: 'more' }, 'en')).toBeUndefined()
  })
})
