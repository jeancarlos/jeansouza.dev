'use client'
import type { Post } from '@/lib/posts'
import type { ButtonOrigin } from '@/components/windows/WindowManager'

interface Props {
  posts: Post[]
  onOpenPost: (post: Post, origin: ButtonOrigin) => void
}

export function BlogListWindow({ posts, onOpenPost }: Props) {
  return (
    <div className="space-y-4 p-6 text-[#f2b8d4]">
      <p className="mb-4 text-xs text-[#b33a73]">$ ls posts/</p>
      {posts.length === 0 && <p className="text-sm text-[#b33a73]">drwxr-xr-x (empty)</p>}
      {posts.map((post) => (
        <button
          key={post.slug}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            onOpenPost(post, { x: rect.left, y: rect.top, width: rect.width, height: rect.height })
          }}
          className="group block w-full border-l-2 border-[#b33a73] py-2 pl-4 text-left transition-colors hover:border-[#e84545]"
        >
          <p className="mb-1 font-mono text-xs text-[#b33a73]">drwxr-xr-x {post.date}</p>
          <p className="font-display font-bold text-[#f2b8d4] transition-colors group-hover:text-white">
            {post.title}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-[#b33a73]">{post.description}</p>
        </button>
      ))}
    </div>
  )
}
