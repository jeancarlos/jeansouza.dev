import { useTranslations } from '../../../i18n/react'
import type { Locale } from '@/i18n/t'
import type { Post } from '@/lib/posts'
import { pageUrl } from '@/lib/pages'
import { cssCenteredPosition } from '@/lib/windowUtils'
import { TerminalWindow } from '@/components/windows/TerminalWindow'
import { useWindowOpener } from '@/components/windows/WindowManager'
import { pageWindow } from '@/components/windows/pageWindows'
import { Typewriter } from '@/components/ui/Typewriter'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'

interface Props {
  locale: Locale
  posts: Post[]
  isFocused: boolean
  /** On the home page the prompt is the page heading; elsewhere the open window owns the h1. */
  isPageHeading: boolean
}

const HOME_SIZE = { width: 'min(600px, 100vw - 40px)', height: 'var(--home-h)' }
const HOME_POSITION = cssCenteredPosition(HOME_SIZE.width, HOME_SIZE.height)

export function Hero({ locale, posts, isFocused, isPageHeading }: Props) {
  const t = useTranslations('hero')
  const tNav = useTranslations('nav')
  const tResume = useTranslations('resume')
  const tMore = useTranslations('more')
  const opener = useWindowOpener()
  const Heading = isPageHeading ? 'h1' : 'p'
  const windowLink = (kind: 'blog' | 'resume' | 'more') => ({
    href: pageUrl({ kind }, locale),
    onClick: opener((origin) => pageWindow({ kind }, locale, posts, origin)),
  })

  return (
    <>
      <span
        aria-hidden="true"
        className={`eyes-in pointer-events-none fixed top-1/2 left-1/2 z-[5] hidden -translate-x-1/2 -translate-y-1/2 text-[12px] transition-opacity select-none motion-reduce:transition-none md:block ${isFocused ? 'opacity-100 delay-1500 duration-600' : 'opacity-0 duration-200'}`}
      >
        👁️👄👁️
      </span>
      <TerminalWindow
        id="home"
        title="~ jeansouza.dev"
        position={HOME_POSITION}
        size={HOME_SIZE}
        zIndex={10}
        isFocused={isFocused}
      >
        <div className="text-brand-text space-y-3 p-6">
          <p className="text-brand-muted text-xs">~ jeansouza.dev</p>
          <Heading className="flex items-center gap-2">
            <span className="text-brand-from select-none" aria-hidden="true">
              {'>'}
            </span>
            <Typewriter
              text={t('prompt')}
              className="font-display text-brand-text text-2xl font-bold"
            />
            <span className="cursor-blink text-brand-from" aria-hidden="true">
              _
            </span>
          </Heading>
          <p className="text-brand-muted pl-5 text-sm">
            <Typewriter text={t('role')} delay={0.8} />
          </p>
          <div className="flex flex-wrap gap-2 pt-4 pl-5">
            <Button href="https://github.com/jeancarlos">
              <Icon name="github" className="mr-1" /> GitHub
            </Button>
            <Button href="https://linkedin.com/in/jeancosouza">
              <Icon name="linkedin" className="mr-1" /> LinkedIn
            </Button>
            <Button {...windowLink('resume')}>
              <Icon name="file-alt" className="mr-1" /> {tResume('title')}
            </Button>
            <Button {...windowLink('blog')}>
              <Icon name="book" className="mr-1" /> {tNav('blog')}
            </Button>
            <Button {...windowLink('more')}>
              <span aria-hidden="true">+</span>
              <span className="sr-only">{tMore('title')}</span>
            </Button>
          </div>
        </div>
      </TerminalWindow>
    </>
  )
}
