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
}

export interface Post extends PostMeta {
  contentHtml: string
}

const postsDirectory = path.join(process.cwd(), 'src/content/posts')

export function getAllPosts(): PostMeta[] {
  const fileNames = fs.readdirSync(postsDirectory)
  const posts = fileNames
    .filter((name) => name.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      const rawDate = data.date
      const date =
        rawDate instanceof Date
          ? rawDate.toISOString().slice(0, 10)
          : String(rawDate)

      return {
        slug,
        title: data.title as string,
        date,
        description: data.description as string,
      }
    })

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPost(slug: string): Promise<Post> {
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  // remark-html is safe here: content is author-controlled markdown in the repo,
  // not user-generated input. Add rehype-sanitize if user content is ever added.
  const processedContent = await remark().use(html).process(content)
  const contentHtml = processedContent.toString()

  const rawDate = data.date
  const date =
    rawDate instanceof Date
      ? rawDate.toISOString().slice(0, 10)
      : String(rawDate)

  return {
    slug,
    title: data.title as string,
    date,
    description: data.description as string,
    contentHtml,
  }
}

export function getAllSlugs(): string[] {
  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames
    .filter((name) => name.endsWith('.md'))
    .map((name) => name.replace(/\.md$/, ''))
}

export async function getAllPostsWithContent(): Promise<Post[]> {
  const metas = getAllPosts()
  return Promise.all(metas.map((meta) => getPost(meta.slug)))
}
