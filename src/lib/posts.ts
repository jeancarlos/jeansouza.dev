import type { Locale } from '@/i18n/t'

export interface PostCover {
  src: string
  srcSet: string
  alt: string
}

export interface Post {
  slug: string
  title: string
  date: string
  description: string
  content: string
  cover: PostCover
  ogImage: string
}

export interface PostEntry {
  id: string
  body?: string
  data: { title: string; date: Date; description: string; cover: PostCover; ogImage: string }
}

/** Posts are `<slug>.<locale>.md`; a post shows only in the locales it was written in. */
export function postsFor(entries: PostEntry[], locale: Locale): Post[] {
  const suffix = `.${locale}`
  return entries
    .filter((e) => e.id.endsWith(suffix))
    .map((e) => ({
      slug: e.id.slice(0, -suffix.length),
      title: e.data.title,
      date: e.data.date.toISOString().slice(0, 10),
      description: e.data.description,
      cover: e.data.cover,
      ogImage: e.data.ogImage,
      content: e.body ?? '',
    }))
    .sort((a, b) => b.date.localeCompare(a.date))
}
