import { LOCALES, type Locale } from '@/i18n/t'
import { splitPostBody, type BodyPart } from './postBody'

interface PostCover {
  src: string
  srcSet: string
  alt: string
}

interface PostThumb {
  src: string
  srcSet: string
}

export interface PostHeading {
  depth: number
  slug: string
  text: string
}

export interface Post {
  slug: string
  title: string
  date: string
  description: string
  body: BodyPart[]
  toc: PostHeading[]
  locales: Locale[]
  cover: PostCover
  thumb: PostThumb
  ogImage: string
}

export interface PostEntry {
  id: string
  rendered?: { html: string; metadata?: { headings?: PostHeading[] } }
  data: {
    title: string
    date: Date
    description: string
    cover: PostCover
    thumb: PostThumb
    ogImage: string
  }
}

/** Posts are `<slug>.<locale>.md`; a post shows only in the locales it was written in. */
export function postsFor(entries: PostEntry[], locale: Locale): Post[] {
  const suffix = `.${locale}`
  const localesOf = (slug: string) =>
    LOCALES.filter((l) => entries.some((e) => e.id === `${slug}.${l}`))
  return entries
    .filter((e) => e.id.endsWith(suffix))
    .map((e) => ({
      slug: e.id.slice(0, -suffix.length),
      title: e.data.title,
      date: e.data.date.toISOString().slice(0, 10),
      description: e.data.description,
      cover: e.data.cover,
      thumb: e.data.thumb,
      ogImage: e.data.ogImage,
      body: splitPostBody(e.rendered?.html ?? '', e.id),
      locales: localesOf(e.id.slice(0, -suffix.length)),
      toc: (e.rendered?.metadata?.headings ?? []).filter((h) => h.depth === 2 || h.depth === 3),
    }))
    .sort((a, b) => b.date.localeCompare(a.date))
}
