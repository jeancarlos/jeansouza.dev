import { getAllPosts } from '@/lib/posts'
import { Blog } from '@/components/sections/Blog'
import { SectionBackground } from '@/components/layout/SectionBackground'
import { setRequestLocale } from 'next-intl/server'

type Props = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return [{ locale: 'pt' }, { locale: 'en' }]
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const posts = getAllPosts(locale as 'pt' | 'en')

  return (
    <SectionBackground>
      <Blog posts={posts} />
    </SectionBackground>
  )
}
