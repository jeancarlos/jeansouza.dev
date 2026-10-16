import { describe, expect, it } from 'vitest'
import { structuredData } from './structuredData'

const post = {
  slug: 'hello',
  title: 'Hello',
  date: '2026-01-01',
  description: 'A post.',
  body: [],
  toc: [],
  locales: ['pt' as const],
  cover: { src: '/c.webp', srcSet: '/c.webp 820w', alt: 'A cover.' },
  thumb: { src: '/t.webp', srcSet: '/t.webp 176w' },
  ogImage: '/og-hello.jpg',
}

interface Node {
  '@type': string
  itemListElement?: { position: number; name: string; item: string }[]
}
const graph = (data: object | undefined) => (data as { '@graph': Node[] })['@graph']
const node = (data: object | undefined, type: string) =>
  graph(data).find((n) => n['@type'] === type)

describe('structuredData', () => {
  it('describes the site and its author on the home page, without breadcrumbs', () => {
    expect(graph(structuredData({ kind: 'home' }, 'en')).map((n) => n['@type'])).toEqual([
      'WebSite',
      'Person',
    ])
  })

  it('describes a post as a BlogPosting with its date, language and canonical URL', () => {
    expect(node(structuredData({ kind: 'post', post }, 'pt'), 'BlogPosting')).toMatchObject({
      headline: 'Hello',
      datePublished: '2026-01-01',
      dateModified: '2026-01-01',
      inLanguage: 'pt-BR',
      url: 'https://jeansouza.dev/pt/blog/hello/',
      image: 'https://jeansouza.dev/og-hello.jpg',
    })
  })

  it('walks a post back through the blog to the home page', () => {
    const crumbs = node(
      structuredData({ kind: 'post', post }, 'pt'),
      'BreadcrumbList'
    )?.itemListElement
    expect(crumbs).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Jean Souza', item: 'https://jeansouza.dev/pt/' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://jeansouza.dev/pt/blog/' },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Hello',
        item: 'https://jeansouza.dev/pt/blog/hello/',
      },
    ])
  })

  it('marks the resume as a profile page under a translated crumb', () => {
    const data = structuredData({ kind: 'resume' }, 'pt')
    expect(node(data, 'ProfilePage')).toBeDefined()
    expect(node(data, 'BreadcrumbList')?.itemListElement?.[1]?.name).toBe('Currículo')
  })

  it('gives a page with no matching type only its breadcrumbs', () => {
    expect(graph(structuredData({ kind: 'more' }, 'en')).map((n) => n['@type'])).toEqual([
      'BreadcrumbList',
    ])
  })
})
