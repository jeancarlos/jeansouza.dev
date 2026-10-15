import type { APIRoute } from 'astro'
import { LOCALES } from '../i18n/t'
import { loadPosts } from '../lib/loadPosts'
import type { Post } from '../lib/posts'
import {
  SITE_URL,
  alternateLinks,
  pageLocales,
  pagePath,
  pageUrl,
  sitePages,
  type Page,
} from '../lib/pages'

function lastChanged(page: Page, posts: Post[]): string | undefined {
  if (page.kind === 'post') return page.post.date
  return page.kind === 'blog' ? posts[0]?.date : undefined
}

export const GET: APIRoute = async () => {
  const byLocale = await Promise.all(LOCALES.map(loadPosts))
  const urls = LOCALES.flatMap((locale, i) => {
    const posts = byLocale[i] ?? []
    return sitePages(posts).map((page) => {
      const lastmod = lastChanged(page, posts)
      const links = alternateLinks(pagePath(page), pageLocales(page))
        .map((l) => `<xhtml:link rel="alternate" hreflang="${l.hreflang}" href="${l.href}"/>`)
        .join('')
      return `<url><loc>${SITE_URL}${pageUrl(page, locale)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}${links}</url>`
    })
  })

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } })
}
