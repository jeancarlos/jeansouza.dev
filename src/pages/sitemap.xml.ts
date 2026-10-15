import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { LOCALES } from '../i18n/t'
import { postsFor } from '../lib/posts'
import { SITE_URL, pagePath, type Page } from '../lib/pages'

const hreflang = { pt: 'pt-BR', en: 'en-US' } as const

export const GET: APIRoute = async () => {
  const posts = postsFor(await getCollection('blog'), 'pt')
  const pages: { page: Page; lastmod?: string }[] = [
    { page: { kind: 'home' } },
    { page: { kind: 'blog' }, lastmod: posts[0]?.date },
    { page: { kind: 'resume' } },
    { page: { kind: 'more' } },
    ...posts.map((post) => ({ page: { kind: 'post' as const, post }, lastmod: post.date })),
  ]

  const urls = pages.flatMap(({ page, lastmod }) => {
    const path = pagePath(page)
    const alternates =
      LOCALES.map(
        (l) =>
          `<xhtml:link rel="alternate" hreflang="${hreflang[l]}" href="${SITE_URL}/${l}/${path}"/>`
      ).join('') +
      `<xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/en/${path}"/>`
    return LOCALES.map(
      (locale) =>
        `<url><loc>${SITE_URL}/${locale}/${path}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}${alternates}</url>`
    )
  })

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } })
}
