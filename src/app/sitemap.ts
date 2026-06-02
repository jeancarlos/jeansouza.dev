import type { MetadataRoute } from 'next'
import { getAllSlugs } from '@/lib/posts'

const BASE = 'https://jeansouza.dev'
const LOCALES = ['pt', 'en'] as const

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getAllSlugs()

  const homeUrls = LOCALES.map((locale) => ({
    url: `${BASE}/${locale}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 1,
  }))

  const postUrls = LOCALES.flatMap((locale) =>
    slugs.map((slug) => ({
      url: `${BASE}/${locale}/blog/${slug}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  )

  return [...homeUrls, ...postUrls]
}
