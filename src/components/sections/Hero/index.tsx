'use client'
import { useTranslations } from 'next-intl'
import { motion, steps } from 'framer-motion'
import dynamic from 'next/dynamic'
import { TerminalWindow } from '@/components/windows/TerminalWindow'
import { WindowButton } from '@/components/windows/WindowButton'
import { Typewriter } from '@/components/ui/Typewriter'
import { Button } from '@/components/ui/Button'
import { useWindowManager } from '@/components/windows/WindowManager'
import type { ButtonOrigin } from '@/components/windows/WindowManager'

const MoreLinksWindowDynamic = dynamic(
  () => import('@/components/windows/MoreLinksWindow').then((m) => m.MoreLinksWindow),
  { ssr: false }
)

const ResumeWindowDynamic = dynamic(
  () => import('@/components/windows/ResumeWindow').then((m) => m.ResumeWindow),
  { ssr: false }
)

interface Props {
  locale: 'pt' | 'en'
  onOpenBlog: (origin: ButtonOrigin) => void
  isFocused?: boolean
}

const SAFE = 20

export function Hero({ locale, onOpenBlog, isFocused = true }: Props) {
  const t = useTranslations('hero')
  const tResume = useTranslations('resume')
  const { focusWindow } = useWindowManager()

  const homeW = 560
  const homeH = 320
  const homeX = typeof window !== 'undefined' ? Math.max(SAFE, (window.innerWidth - homeW) / 2) : 100
  const homeY = typeof window !== 'undefined' ? Math.max(SAFE + 40, (window.innerHeight - homeH) / 2) : 100

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
      isFocused={isFocused}
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
          <WindowButton
            windowId="resume"
            windowUrl={`/${locale}/#resume`}
            windowTitle="~/resume"
            windowContent={<ResumeWindowDynamic locale={locale} />}
            fullscreen
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
