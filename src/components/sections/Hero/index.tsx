'use client'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { motion, steps } from 'framer-motion'
import dynamic from 'next/dynamic'
import { TerminalWindow } from '@/components/windows/TerminalWindow'
import { WindowButton } from '@/components/windows/WindowButton'
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

const SAFE = 20

export function Hero({ locale, posts }: Props) {
  const t = useTranslations('hero')
  const tResume = useTranslations('resume')
  const { openWindow, focusWindow } = useWindowManager()

  const homeW = 560
  const homeH = 320
  const homeX = typeof window !== 'undefined' ? Math.max(SAFE, (window.innerWidth - homeW) / 2) : 100
  const homeY = typeof window !== 'undefined' ? Math.max(SAFE + 40, (window.innerHeight - homeH) / 2) : 100

  const nextLocale = locale === 'pt' ? 'en' : 'pt'
  const router = useRouter()
  const pathname = usePathname()

  // Blog post needs dynamic data from the list's onOpenPost callback — keep as function
  const openBlogPost = (post: Post) => {
    const w = 820
    const h = 660
    openWindow({
      id: `post-${post.slug}`,
      url: `/${locale}/blog/${post.slug}`,
      title: `~/blog/${post.slug}`,
      content: (
        <BlogPostWindowDynamic title={post.title} date={post.date} contentHtml={post.contentHtml} />
      ),
      position: (() => {
        const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
        const vh = typeof window !== 'undefined' ? window.innerHeight : 800
        return {
          x: Math.max(SAFE, Math.min((vw - w) / 2, vw - w - SAFE)),
          y: Math.max(SAFE, Math.min((vh - h) / 2, vh - h - SAFE)),
        }
      })(),
      size: { width: w, height: h },
      defaultSize: 'medium',
      isExpanded: false,
      isMinimized: false,
    })
    // keep blog list on top
    setTimeout(() => focusWindow('blog'), 0)
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
          <span className="select-none text-[#e84545]">{'>'}</span>
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

          <WindowButton
            windowId="resume"
            windowUrl={`/${locale}/#resume`}
            windowTitle="~/resume"
            windowContent={<ResumeWindowDynamic locale={locale} />}
            fullscreen
          >
            <i className="fas fa-file-alt mr-1" aria-hidden="true" /> {tResume('title')}
          </WindowButton>

          <WindowButton
            windowId="blog"
            windowUrl={`/${locale}/blog`}
            windowTitle="~/blog"
            windowContent={<BlogListWindowDynamic posts={posts} onOpenPost={openBlogPost} />}
            windowSize={{ width: 820, height: 620 }}
          >
            <i className="fas fa-book mr-1" aria-hidden="true" /> Blog
          </WindowButton>

          <WindowButton
            windowId="more-links"
            windowUrl={`/${locale}/#more`}
            windowTitle="~/more"
            windowContent={<MoreLinksWindowDynamic />}
            windowSize={{ width: 320, height: 280 }}
            defaultSize="compact"
            position={{
              x: Math.min(homeX + homeW + SAFE, (typeof window !== 'undefined' ? window.innerWidth : 1200) - 320 - SAFE),
              y: Math.max(SAFE, homeY),
            }}
            aria-label="More links"
          >
            +
          </WindowButton>
        </div>
      </div>
    </TerminalWindow>
  )
}
