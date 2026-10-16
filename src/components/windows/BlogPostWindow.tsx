import { COVER_SIZE } from '@/lib/coverSize'
import type { Post } from '@/lib/posts'
import { pageUrl } from '@/lib/pages'
import { LanguageNotice } from './LanguageNotice'
import { Timeline } from '@/components/ui/Timeline'
import { TocDisclosure, TocSidebar } from './TableOfContents'

export function BlogPostWindow({ post }: { post: Post }) {
  const hasToc = post.toc.length > 1
  return (
    <div className="text-text @container">
      <LanguageNotice
        available={post.locales}
        hrefFor={(locale) => pageUrl({ kind: 'post', post }, locale)}
      />
      <img
        src={post.cover.src}
        srcSet={post.cover.srcSet}
        sizes="(min-width: 1072px) 1024px, 100vw"
        {...COVER_SIZE}
        alt={post.cover.alt}
        fetchPriority="high"
        data-fade=""
        className="block h-auto w-full @min-[800px]:h-80 @min-[800px]:object-cover @min-[800px]:object-[50%_10%]"
      />
      <div
        className={`mx-auto max-w-3xl p-6 ${hasToc ? '@min-[900px]:grid @min-[900px]:max-w-none @min-[900px]:grid-cols-[12rem_minmax(0,48rem)] @min-[900px]:justify-center @min-[900px]:gap-8' : ''}`}
      >
        {hasToc && <TocSidebar headings={post.toc} />}
        <div className="min-w-0">
          <p className="text-brand-muted mb-4 truncate font-mono text-xs">$ cat {post.slug}.md</p>
          <article className="prose dark:prose-invert font-reading max-w-none">
            <h1 className="font-display text-brand-text">{post.title}</h1>
            <p className="text-brand-muted -mt-4 mb-4 font-mono text-xs">
              <time dateTime={post.date}>{post.date}</time>
            </p>
            {hasToc && <TocDisclosure headings={post.toc} />}
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
    </div>
  )
}
