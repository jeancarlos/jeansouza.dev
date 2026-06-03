'use client'
import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { motion, steps } from 'framer-motion'
import dynamic from 'next/dynamic'
import { TerminalWindow } from '@/components/windows/TerminalWindow'
import { WindowButton } from '@/components/windows/WindowButton'
import { Typewriter } from '@/components/ui/Typewriter'
import { Button } from '@/components/ui/Button'
import type { ButtonOrigin } from '@/components/windows/WindowManager'
import { useIsMobile } from '@/lib/useIsMobile'
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
}

const HOME_W = 560
const HOME_H = 320

export function Hero({ locale, onOpenBlog, isFocused = true }: Props) {
  const t = useTranslations('hero')
  const tResume = useTranslations('resume')
  const isMobile = useIsMobile()
  const [homePos, setHomePos] = useState<{ x: number; y: number } | null>(null)
  const [homeW, setHomeW] = useState(HOME_W)
  const [resumeSize, setResumeSize] = useState<{ width: number; height: number } | null>(null)

  useEffect(() => {
    const topOffset = isMobile ? 0 : TOPBAR_HEIGHT
    const w = isMobile ? Math.min(getViewport().vw - 32, HOME_W) : HOME_W
    setHomeW(w)
    setHomePos(centeredPosition(w, HOME_H, topOffset))
    const { vw, vh } = getViewport()
    setResumeSize({ width: Math.min(1024, vw - WINDOW_SAFE * 2), height: vh - WINDOW_SAFE * 2 - topOffset })
  }, [isMobile])

  if (!homePos || !resumeSize) return null


  return (
    <TerminalWindow
      id="home"
      url={`/${locale}/`}
      title="~ jeansouza.dev"
      position={homePos}
      size={{ width: homeW, height: HOME_H }}
      isExpanded={false}
      isMinimized={false}
      zIndex={10}
      closeable={false}
      minimizable={false}
      expandable={false}
      resizable={false}
      isFocused={isFocused}
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
          <WindowButton
            windowId="resume"
            windowUrl={`/${locale}/#resume`}
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
            <i className="fas fa-book mr-1" aria-hidden="true" /> Blog
          </Button>
          <WindowButton
            windowId="more-links"
            windowUrl={`/${locale}/#more`}
            windowTitle="~/more"
            windowContent={<MoreLinksWindowDynamic />}
            windowSize={{ width: 320, height: 280 }}
            defaultSize="compact"
            aria-label="More links"
          >
            +
          </WindowButton>
        </div>
      </div>
    </TerminalWindow>
  )
}
