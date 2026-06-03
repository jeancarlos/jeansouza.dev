interface Props {
  title: string
  date: string
  contentHtml: string
}

export function BlogPostWindow({ title, date, contentHtml }: Props) {
  const fileSlug = title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
  return (
    <div className="p-6 text-[#f2b8d4]">
      <p className="mb-4 font-mono text-xs text-[#b33a73]">$ cat {fileSlug}.md</p>
      <article className="prose prose-invert max-w-none">
        <h1 className="font-display text-[#f2b8d4]">{title}</h1>
        <p className="-mt-4 mb-4 font-mono text-xs text-[#b33a73]">{date}</p>
        {/* contentHtml is sanitized via rehype-sanitize in src/lib/posts.ts */}
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </article>
    </div>
  )
}
