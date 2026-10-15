import { COVER_SIZE } from '@/lib/coverSize'
import type { Post } from '@/lib/posts'
import { Timeline } from '@/components/ui/Timeline'

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
        <article className="prose dark:prose-invert font-reading">
          <h1 className="font-display text-brand-text">{post.title}</h1>
          <p className="text-brand-muted -mt-4 mb-4 font-mono text-xs">
            <time dateTime={post.date}>{post.date}</time>
          </p>
          {post.body.map((part, i) =>
            'html' in part ? (
              <div key={i} dangerouslySetInnerHTML={{ __html: part.html }} />
            ) : (
              <Timeline key={i} entries={part.timeline} />
            )
          )}
        </article>
      </div>
    </div>
  )
}
