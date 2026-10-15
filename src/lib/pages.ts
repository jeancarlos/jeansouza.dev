import { translator, type Locale } from '@/i18n/t'
import type { Post } from '@/lib/posts'

export const SITE_URL = 'https://jeansouza.dev'

export type Page =
  | { kind: 'home' }
  | { kind: 'blog' }
  | { kind: 'resume' }
  | { kind: 'more' }
  | { kind: 'post'; post: Post }

/** Path after the locale segment, with the trailing slash the static host serves. */
export function pagePath(page: Page): string {
  if (page.kind === 'home') return ''
  if (page.kind === 'post') return `blog/${page.post.slug}/`
  return `${page.kind}/`
}

export function pageUrl(page: Page, locale: Locale): string {
  return `/${locale}/${pagePath(page)}`
}

export function pageFromPath(pathname: string, posts: Post[]): Page | undefined {
  const rest = pathname.replace(/^\/(pt|en)\//, '')
  if (rest === '') return { kind: 'home' }
  if (rest === 'blog/' || rest === 'resume/' || rest === 'more/') {
    return { kind: rest.slice(0, -1) as 'blog' | 'resume' | 'more' }
  }
  const post = posts.find((p) => rest === `blog/${p.slug}/`)
  return post && { kind: 'post', post }
}

export function pageMeta(page: Page, locale: Locale): { title: string; description: string } {
  if (page.kind === 'post') {
    return { title: `${page.post.title} — Jean Souza`, description: page.post.description }
  }
  const t = translator(locale)
  return { title: t(`meta.${page.kind}.title`), description: t(`meta.${page.kind}.description`) }
}
