import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

export interface PostMeta {
  slug: string
  title: string
  date: string
  description: string
  locale: string
}

export interface Post extends PostMeta {
  contentHtml: string
}

type Locale = 'pt' | 'en'

const postsDirectory = path.join(process.cwd(), 'src/content/posts')

function parseLocaleFromFilename(fileName: string): { slug: string; locale: Locale } | null {
  const match = fileName.match(/^(.+)\.(pt|en)\.md$/)
  if (!match) return null
  return { slug: match[1], locale: match[2] as Locale }
}

function readPostMeta(fileName: string): PostMeta & { locale: Locale } {
  const parsed = parseLocaleFromFilename(fileName)!
  const fullPath = path.join(postsDirectory, fileName)
  const { data } = matter(fs.readFileSync(fullPath, 'utf8'))
  const rawDate = data.date
  const date = rawDate instanceof Date ? rawDate.toISOString().slice(0, 10) : String(rawDate)
  return {
    slug: parsed.slug,
    locale: parsed.locale,
    title: String(data.title ?? ''),
    date,
    description: String(data.description ?? ''),
  }
}

export function getAllPosts(locale: Locale = 'pt'): PostMeta[] {
  const fileNames = fs.readdirSync(postsDirectory).filter((f) => f.endsWith('.md'))

  const bySlug = new Map<string, Map<Locale, string>>()
  for (const fileName of fileNames) {
    const parsed = parseLocaleFromFilename(fileName)
    if (!parsed) continue
    if (!bySlug.has(parsed.slug)) bySlug.set(parsed.slug, new Map())
    bySlug.get(parsed.slug)!.set(parsed.locale, fileName)
  }

  const fallback: Locale = locale === 'pt' ? 'en' : 'pt'

  const posts: PostMeta[] = []
  for (const [, variants] of bySlug) {
    const fileName = variants.get(locale) ?? variants.get(fallback)
    if (!fileName) continue
    posts.push(readPostMeta(fileName))
  }

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1))
}

export function getAllSlugs(): string[] {
  const fileNames = fs.readdirSync(postsDirectory).filter((f) => f.endsWith('.md'))
  const slugs = new Set<string>()
  for (const f of fileNames) {
    const parsed = parseLocaleFromFilename(f)
    if (parsed) slugs.add(parsed.slug)
  }
  return Array.from(slugs)
}

export async function getPost(slug: string, locale: Locale = 'pt'): Promise<Post | null> {
  const fallback: Locale = locale === 'pt' ? 'en' : 'pt'
  const preferred = path.join(postsDirectory, `${slug}.${locale}.md`)
  const fallbackPath = path.join(postsDirectory, `${slug}.${fallback}.md`)

  const filePath = fs.existsSync(preferred)
    ? preferred
    : fs.existsSync(fallbackPath)
      ? fallbackPath
      : null

  if (!filePath) return null

  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)
  const processedContent = await remark().use(html).process(content)
  const rawDate = data.date
  const date = rawDate instanceof Date ? rawDate.toISOString().slice(0, 10) : String(rawDate)
  const usedLocale = filePath.endsWith(`.${locale}.md`) ? locale : fallback

  return {
    slug,
    locale: usedLocale,
    title: String(data.title ?? ''),
    date,
    description: String(data.description ?? ''),
    contentHtml: processedContent.toString(),
  }
}

export async function getAllPostsWithContent(locale: Locale = 'pt'): Promise<Post[]> {
  const slugs = getAllSlugs()
  const posts = await Promise.all(slugs.map((slug) => getPost(slug, locale)))
  return (posts.filter(Boolean) as Post[]).sort((a, b) => (a.date > b.date ? -1 : 1))
}
