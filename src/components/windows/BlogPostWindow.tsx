'use client'
import Markdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'
import { toFileSlug } from '@/lib/format'

interface Props {
  title: string
  date: string
  content: string
}

export function BlogPostWindow({ title, date, content }: Props) {
  const fileSlug = toFileSlug(title)
  return (
    <div className="text-brand-text p-6">
      <p className="text-brand-to mb-4 font-mono text-xs">$ cat {fileSlug}.md</p>
      <article className="prose prose-invert max-w-none">
        <h1 className="font-display text-brand-text">{title}</h1>
        <p className="text-brand-to -mt-4 mb-4 font-mono text-xs">{date}</p>
        <Markdown rehypePlugins={[rehypeSanitize]}>{content}</Markdown>
      </article>
    </div>
  )
}
