'use client'
import Markdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'

interface Props {
  slug: string
  title: string
  date: string
  content: string
}

export function BlogPostWindow({ slug, title, date, content }: Props) {
  return (
    <div className="text-text p-6">
      <p className="text-brand-to mb-4 truncate font-mono text-xs">$ cat {slug}.md</p>
      <article className="prose dark:prose-invert max-w-none">
        <h1 className="font-display text-brand-text">{title}</h1>
        <p className="text-brand-to -mt-4 mb-4 font-mono text-xs">{date}</p>
        <Markdown rehypePlugins={[rehypeSanitize]}>{content}</Markdown>
      </article>
    </div>
  )
}
