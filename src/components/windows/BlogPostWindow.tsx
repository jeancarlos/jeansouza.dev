import Markdown from 'react-markdown'
import rehypeSanitize from 'rehype-sanitize'
import { COVER_SIZE } from '@/lib/coverSize'
import type { Post } from '@/lib/posts'

export function BlogPostWindow({ post }: { post: Post }) {
  return (
    <div className="text-text">
      <img
        src={post.cover.src}
        srcSet={post.cover.srcSet}
        sizes="(min-width: 860px) 820px, 100vw"
        {...COVER_SIZE}
        alt={post.cover.alt}
        loading="lazy"
        className="block h-auto w-full"
      />
      <div className="mx-auto max-w-prose p-6">
        <p className="text-brand-muted mb-4 truncate font-mono text-xs">$ cat {post.slug}.md</p>
        <article className="prose dark:prose-invert">
          <h1 className="font-display text-brand-text">{post.title}</h1>
          <p className="text-brand-muted -mt-4 mb-4 font-mono text-xs">
            <time dateTime={post.date}>{post.date}</time>
          </p>
          <Markdown rehypePlugins={[rehypeSanitize]}>{post.content}</Markdown>
        </article>
      </div>
    </div>
  )
}
