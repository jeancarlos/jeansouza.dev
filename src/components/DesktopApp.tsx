import type { Post } from '@/lib/posts'
import { LocaleProvider } from '../i18n/react'
import { WindowManagerProvider } from './windows/WindowManager'
import { HomeClient } from './HomeClient'

interface Props {
  locale: 'pt' | 'en'
  posts: Post[]
  initialOpen?: 'blog' | 'resume' | 'more'
  initialPost?: Post
}

/**
 * The whole desktop as one island. It is deliberately the same HomeClient the
 * Next build rendered — the window manager, chrome, drag and stacking are not
 * reimplemented for Astro, so appearance and behaviour cannot drift.
 *
 * The two providers Next supplied from its layout are supplied here instead.
 */
export function DesktopApp({ locale, posts, initialOpen, initialPost }: Props) {
  return (
    <LocaleProvider locale={locale}>
      <WindowManagerProvider>
        <HomeClient
          posts={posts}
          locale={locale}
          initialOpen={initialOpen}
          initialPost={initialPost}
        />
      </WindowManagerProvider>
    </LocaleProvider>
  )
}
