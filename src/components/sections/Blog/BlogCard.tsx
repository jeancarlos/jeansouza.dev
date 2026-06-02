import { Link } from '@/i18n/navigation'
import type { PostMeta } from '@/lib/posts'

interface Props {
  post: PostMeta
}

export function BlogCard({ post }: Props) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group border-mauve hover:border-green block border-l-2 py-3 pl-4 transition-colors"
    >
      <p className="text-overlay mb-1 font-mono text-xs">drwxr-xr-x {post.date}</p>
      <p className="font-display text-text group-hover:text-green font-bold transition-colors">
        {post.title}
      </p>
      <p className="text-subtext mt-1 text-sm leading-relaxed">{post.description}</p>
    </Link>
  )
}
