'use client'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { motion, steps } from 'framer-motion'
import dynamic from 'next/dynamic'
import { TerminalWindow } from '@/components/windows/TerminalWindow'
import { Typewriter } from '@/components/ui/Typewriter'
import { Button } from '@/components/ui/Button'
import { useWindowManager } from '@/components/windows/WindowManager'
import type { Post } from '@/lib/posts'

const MoreLinksWindowDynamic = dynamic(
  () => import('@/components/windows/MoreLinksWindow').then((m) => m.MoreLinksWindow),
  { ssr: false }
)

const ResumeWindowDynamic = dynamic(
  () => import('@/components/windows/ResumeWindow').then((m) => m.ResumeWindow),
  { ssr: false }
)

const BlogListWindowDynamic = dynamic(
  () => import('@/components/windows/BlogListWindow').then((m) => m.BlogListWindow),
  { ssr: false }
)

const BlogPostWindowDynamic = dynamic(
  () => import('@/components/windows/BlogPostWindow').then((m) => m.BlogPostWindow),
  { ssr: false }
)

interface Props {
  locale: 'pt' | 'en'
  posts: Post[]
}

export function Hero({ locale, posts }: Props) {
  const t = useTranslations('hero')
  const tResume = useTranslations('resume')
  const { openWindow } = useWindowManager()

  // Center on viewport — SSR safe
  const homeW = 560
  const homeH = 320
  const homeX = typeof window !== 'undefined' ? Math.max(20, (window.innerWidth - homeW) / 2) : 100
  const homeY = typeof window !== 'undefined' ? Math.max(60, (window.innerHeight - homeH) / 2) : 100

  const nextLocale = locale === 'pt' ? 'en' : 'pt'
  const router = useRouter()
  const pathname = usePathname()

  const openResume = () => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800
    openWindow({
      id: 'resume',
      url: `/${locale}/#resume`,
      title: '~/resume',
      content: <ResumeWindowDynamic locale={locale} />,
      position: { x: 40, y: 40 },
      size: { width: vw - 80, height: vh - 80 },
      defaultSize: 'fullscreen',
      isExpanded: true,
      isMinimized: false,
    })
  }

  const openBlogPost = (post: Post) => {
    openWindow({
      id: `post-${post.slug}`,
      url: `/${locale}/blog/${post.slug}`,
      title: `~/blog/${post.slug}`,
      content: (
        <BlogPostWindowDynamic title={post.title} date={post.date} contentHtml={post.contentHtml} />
      ),
      position: { x: homeX + 100, y: homeY + 100 },
      size: { width: 680, height: 560 },
      defaultSize: 'medium',
      isExpanded: false,
      isMinimized: false,
    })
  }

  const openBlog = () => {
    openWindow({
      id: 'blog',
      url: `/${locale}/blog`,
      title: '~/blog',
      content: <BlogListWindowDynamic posts={posts} onOpenPost={openBlogPost} />,
      position: { x: homeX + 50, y: homeY + 50 },
      size: { width: 680, height: 520 },
      defaultSize: 'medium',
      isExpanded: false,
      isMinimized: false,
    })
  }

  const openMoreLinks = () => {
    openWindow({
      id: 'more-links',
      url: `/${locale}/#more`,
      title: '~/more',
      content: <MoreLinksWindowDynamic />,
      position: { x: homeX + 50, y: homeY + 50 },
      size: { width: 320, height: 280 },
      defaultSize: 'compact',
      isExpanded: false,
      isMinimized: false,
    })
  }

  return (
    <TerminalWindow
      id="home"
      url={`/${locale}/`}
      title="~ jeansouza.dev"
      position={{ x: homeX, y: homeY }}
      size={{ width: homeW, height: homeH }}
      isExpanded={false}
      isMinimized={false}
      zIndex={10}
      closeable={false}
    >
      <div className="space-y-3 p-6 text-[#f2b8d4]">
        <p className="text-xs text-[#b33a73]">~ jeansouza.dev</p>
        <p className="flex items-center gap-2">
          <span className="text-[#e84545] select-none">{'>'}</span>
          <Typewriter
            text={t('prompt')}
            className="font-display text-2xl font-bold text-[#f2b8d4]"
          />
          <motion.span
            className="text-[#e84545]"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: steps(2, 'start') }}
            aria-hidden="true"
          >
            _
          </motion.span>
        </p>
        <p className="pl-5 text-sm text-[#b33a73]">
          <Typewriter text={t('role')} delay={0.8} />
        </p>
        <div className="flex flex-wrap gap-2 pt-4 pl-5">
          <Button href="https://github.com/jeancarlos">
            <i className="fab fa-github mr-1" aria-hidden="true" /> GitHub
          </Button>
          <Button href="https://linkedin.com/in/jeancosouza">
            <i className="fab fa-linkedin mr-1" aria-hidden="true" /> LinkedIn
          </Button>
          <Button
            onClick={() => router.replace(pathname, { locale: nextLocale })}
            aria-label={`Switch to ${nextLocale.toUpperCase()}`}
          >
            {locale.toUpperCase()}
          </Button>
          <Button onClick={openResume}>
            <i className="fas fa-file-alt mr-1" aria-hidden="true" /> {tResume('title')}
          </Button>
          <Button onClick={openBlog}>
            <i className="fas fa-book mr-1" aria-hidden="true" /> Blog
          </Button>
          <Button onClick={openMoreLinks} aria-label="More links">
            +
          </Button>
        </div>
      </div>
    </TerminalWindow>
  )
}
