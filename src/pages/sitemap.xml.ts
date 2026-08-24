import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { LOCALES } from '../i18n/t'

/**
 * Written by hand rather than via @astrojs/sitemap, which emits
 * `sitemap-index.xml` plus `sitemap-0.xml`. The deployed robots.txt points at
 * `/sitemap.xml`, and that URL already exists in the wild — keeping it is
 * cheaper than a redirect the static host cannot serve.
 */
export const GET: APIRoute = async () => {
  const posts = await getCollection('blog')
  const lastmod = new Date().toISOString()

  const paths = ['', 'blog/', 'more/', 'resume/']
  const urls = LOCALES.flatMap((locale) => {
    const suffix = `.${locale}`
    const postPaths = posts
      .filter((p) => p.id.endsWith(suffix))
      .map((p) => `blog/${p.id.slice(0, -suffix.length)}/`)
    return [...paths, ...postPaths].map((path) => `https://jeansouza.dev/${locale}/${path}`)
  })

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (loc) =>
      `<url>\n<loc>${loc}</loc>\n<lastmod>${lastmod}</lastmod>\n<changefreq>monthly</changefreq>\n</url>`,
  )
  .join('\n')}
</urlset>
`

  return new Response(body, { headers: { 'Content-Type': 'application/xml' } })
}
