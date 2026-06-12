'use client'
import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { motion, steps } from 'framer-motion'
import dynamic from 'next/dynamic'
import { TerminalWindow } from '@/components/windows/TerminalWindow'
import { WindowButton } from '@/components/windows/WindowButton'
import { Typewriter } from '@/components/ui/Typewriter'
import { Button } from '@/components/ui/Button'
import { useWindowManager, type ButtonOrigin } from '@/components/windows/WindowManager'
import { useIsMobile } from '@/lib/useIsMobile'
import { useViewport } from '@/lib/useViewport'
import { centeredPosition, getViewport, WINDOW_SAFE, TOPBAR_HEIGHT } from '@/lib/windowUtils'

const MoreLinksWindowDynamic = dynamic(
  async () => import('@/components/windows/MoreLinksWindow').then((m) => m.MoreLinksWindow),
  { ssr: false }
)

const ResumeWindowDynamic = dynamic(
  async () => import('@/components/windows/ResumeWindow').then((m) => m.ResumeWindow),
  { ssr: false }
)

interface Props {
  locale: 'pt' | 'en'
  onOpenBlog: (origin: ButtonOrigin) => void
  isFocused?: boolean
  /** Deep link support: opens this window on mount (/{locale}/resume/, /{locale}/more/). */
  initialOpen?: 'resume' | 'more'
}

// Wide enough for all action buttons on one row in pt (the longest locale);
// on mobile the buttons wrap, so the box gets taller instead.
const HOME_W = 600
const HOME_H = 256
const HOME_H_MOBILE = 360

export function Hero({ locale, onOpenBlog, isFocused = true, initialOpen }: Props) {
  const t = useTranslations('hero')
  const tNav = useTranslations('nav')
  const tResume = useTranslations('resume')
  const tMore = useTranslations('more')
  const viewport = useViewport()
  const isMobile = useIsMobile()
  const topOffset = TOPBAR_HEIGHT
  const { openWindow } = useWindowManager()

  const initialOpenedRef = useRef(false)
  useEffect(() => {
    if (!initialOpen || initialOpenedRef.current) return
    initialOpenedRef.current = true
    const { vw, vh } = getViewport()
    if (initialOpen === 'resume') {
      const size = {
        width: Math.min(1024, vw - WINDOW_SAFE * 2),
        height: vh - WINDOW_SAFE * 2 - TOPBAR_HEIGHT,
      }
      openWindow({
        id: 'resume',
        url: `/${locale}/resume/`,
        title: '~/resume',
        content: <ResumeWindowDynamic locale={locale} />,
        position: centeredPosition(size.width, size.height, TOPBAR_HEIGHT),
        size,
        defaultSize: 'large',
        isExpanded: false,
        isMinimized: false,
      })
    } else {
      const size = { width: 320, height: 280 }
      openWindow({
        id: 'more-links',
        url: `/${locale}/more/`,
        title: '~/more',
        content: <MoreLinksWindowDynamic />,
        position: centeredPosition(size.width, size.height, TOPBAR_HEIGHT),
        size,
        defaultSize: 'compact',
        isExpanded: false,
        isMinimized: false,
      })
    }
  }, [initialOpen, locale, openWindow])

  // useViewport uses useSyncExternalStore with getServerSnapshot
  // {vw:1200, vh:800}, so server and client first render return the same
  // values — no hydration mismatch. After mount, the real viewport triggers
  // a re-render and these derivations update automatically.
  const homeW = isMobile ? Math.min(viewport.vw - 32, HOME_W) : HOME_W
  const homeH = isMobile ? HOME_H_MOBILE : HOME_H
  const homePos = centeredPosition(homeW, homeH, topOffset, viewport)
  const resumeSize = {
    width: Math.min(1024, viewport.vw - WINDOW_SAFE * 2),
    height: viewport.vh - WINDOW_SAFE * 2 - topOffset,
  }

  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none fixed left-1/2 top-1/2 z-[5] -translate-x-1/2 -translate-y-1/2 select-none text-[12px] hidden md:block"
      >
        👁️👄👁️
      </span>
    <TerminalWindow
      id="home"
      url={`/${locale}/`}
      title="~ jeansouza.dev"
      position={homePos}
      size={{ width: homeW, height: homeH }}
      isExpanded={false}
      isMinimized={false}
      zIndex={10}
      closeable={false}
      minimizable={false}
      expandable={false}
      resizable={false}
      isFocused={isFocused}
    >
      <div className="text-brand-text space-y-3 p-6">
        <p className="text-brand-to text-xs">~ jeansouza.dev</p>
        <p className="flex items-center gap-2">
          <span className="text-brand-from select-none">{'>'}</span>
          <Typewriter
            text={t('prompt')}
            className="font-display text-brand-text text-2xl font-bold"
          />
          <motion.span
            className="text-brand-from"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: steps(2, 'start') }}
            aria-hidden="true"
          >
            _
          </motion.span>
        </p>
        <p className="text-brand-to pl-5 text-sm">
          <Typewriter text={t('role')} delay={0.8} />
        </p>
        <div className="flex flex-wrap gap-2 pt-4 pl-5">
          <Button href="https://github.com/jeancarlos">
            <i className="fab fa-github mr-1" aria-hidden="true" /> GitHub
          </Button>
          <Button href="https://linkedin.com/in/jeancosouza">
            <i className="fab fa-linkedin mr-1" aria-hidden="true" /> LinkedIn
          </Button>
          <WindowButton
            windowId="resume"
            windowUrl={`/${locale}/resume/`}
            windowTitle="~/resume"
            windowContent={<ResumeWindowDynamic locale={locale} />}
            windowSize={resumeSize}
            defaultSize="large"
          >
            <i className="fas fa-file-alt mr-1" aria-hidden="true" /> {tResume('title')}
          </WindowButton>
          <Button
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              onOpenBlog({ x: rect.left, y: rect.top, width: rect.width, height: rect.height })
            }}
          >
            <i className="fas fa-book mr-1" aria-hidden="true" /> {tNav('blog')}
          </Button>
          <WindowButton
            windowId="more-links"
            windowUrl={`/${locale}/more/`}
            windowTitle="~/more"
            windowContent={<MoreLinksWindowDynamic />}
            windowSize={{ width: 320, height: 280 }}
            defaultSize="compact"
            aria-label={tMore('title')}
          >
            +
          </WindowButton>
        </div>
      </div>
    </TerminalWindow>
    </>
  )
}
