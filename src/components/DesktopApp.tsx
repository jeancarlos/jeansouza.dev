import { useCallback } from 'react'
import type { Locale } from '@/i18n/t'
import type { Post } from '@/lib/posts'
import { pageFromPath, pageMeta, pageUrl } from '@/lib/pages'
import { LocaleProvider } from '../i18n/react'
import { WindowManagerProvider } from './windows/WindowManager'
import { windowsForPage } from './windows/pageWindows'
import { HomeClient } from './HomeClient'

interface Props {
  locale: Locale
  posts: Post[]
  /** The URL this copy of the page was rendered for. */
  pathname: string
}

export function DesktopApp({ locale, posts, pathname }: Props) {
  const page = pageFromPath(pathname, posts)
  const windowsForPath = useCallback(
    (path: string) => windowsForPage(pageFromPath(path, posts), locale, posts),
    [locale, posts]
  )

  return (
    <LocaleProvider locale={locale}>
      <WindowManagerProvider
        initialWindows={windowsForPage(page, locale, posts)}
        windowsForPath={windowsForPath}
        homeUrl={pageUrl({ kind: 'home' }, locale)}
        homeTitle={pageMeta({ kind: 'home' }, locale).title}
      >
        <HomeClient locale={locale} posts={posts} isHomePage={page?.kind === 'home'} />
      </WindowManagerProvider>
    </LocaleProvider>
  )
}
