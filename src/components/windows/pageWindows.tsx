import type { Locale } from '@/i18n/t'
import type { Post } from '@/lib/posts'
import { pageMeta, pageUrl, type Page } from '@/lib/pages'
import {
  TOPBAR_HEIGHT,
  WINDOW_SAFE,
  centeredPosition,
  cssCenteredPosition,
  cssTopAnchoredPosition,
  getViewport,
  topAnchoredPosition,
} from '@/lib/windowUtils'
import type { ButtonOrigin, WindowConfig } from './WindowManager'
import { BlogListWindow } from './BlogListWindow'
import { BlogPostWindow } from './BlogPostWindow'
import { MoreLinksWindow } from './MoreLinksWindow'
import { ResumeWindow } from './ResumeWindow'

const LIST_W = 820
const MORE_SIZE = { width: 320, height: 280 }

/**
 * A window opened by a click is placed in pixels so it can grow out of the
 * button; one rendered for the page's own URL is placed in CSS so the server
 * can render it exactly where the browser will keep it.
 */
function listPlacement(origin: ButtonOrigin | undefined) {
  const size = { width: LIST_W, height: 'auto' }
  if (!origin) return { size, position: cssTopAnchoredPosition(LIST_W, 0) }
  const anchor = topAnchoredPosition(LIST_W, TOPBAR_HEIGHT)
  return { size, position: anchor }
}

const READING_W = 1024
const CLEARS_TOPBAR_TOGGLES = 1200

function readingPlacement(origin: ButtonOrigin | undefined) {
  const gap = WINDOW_SAFE * 2
  if (!origin) {
    const top = `clamp(0px, (${CLEARS_TOPBAR_TOGGLES}px - 100vw) * 1000, ${TOPBAR_HEIGHT}px)`
    const width = `min(${READING_W}px, 100vw - ${gap}px)`
    return {
      size: { width, height: `calc(100dvh - ${top} - ${gap}px)` },
      position: {
        x: `max(${WINDOW_SAFE}px, (100vw - ${width}) / 2)`,
        y: `calc(${top} + ${WINDOW_SAFE}px)`,
      },
    }
  }
  const { vw, vh } = getViewport()
  const top = vw >= CLEARS_TOPBAR_TOGGLES ? 0 : TOPBAR_HEIGHT
  const size = { width: Math.min(READING_W, vw - gap), height: vh - gap - top }
  return { size, position: centeredPosition(size.width, size.height, top) }
}

function morePlacement(origin: ButtonOrigin | undefined) {
  const { width, height } = MORE_SIZE
  const position = origin
    ? centeredPosition(width, height, TOPBAR_HEIGHT)
    : cssCenteredPosition(width, height)
  return { size: MORE_SIZE, position }
}

/**
 * A window opened by a click is placed in pixels so it can grow out of the
 * button; one rendered for the page's own URL is placed in CSS so the server
 * can render it exactly where the browser will keep it.
 */
function placement(page: Exclude<Page, { kind: 'home' }>, origin: ButtonOrigin | undefined) {
  if (page.kind === 'blog') return listPlacement(origin)
  if (page.kind === 'post' || page.kind === 'resume') return readingPlacement(origin)
  return morePlacement(origin)
}

function content(page: Page, locale: Locale, posts: Post[], background: boolean) {
  if (page.kind === 'blog') return <BlogListWindow posts={posts} priority={!background} />
  if (page.kind === 'post') return <BlogPostWindow post={page.post} />
  if (page.kind === 'resume') return <ResumeWindow locale={locale} />
  return <MoreLinksWindow />
}

const TITLES = { blog: '~/blog', resume: '~/resume', more: '~/more' } as const

export function pageWindow(
  page: Exclude<Page, { kind: 'home' }>,
  locale: Locale,
  posts: Post[],
  origin?: ButtonOrigin,
  background = false
): WindowConfig {
  return {
    id: page.kind === 'post' ? `post-${page.post.slug}` : page.kind,
    url: pageUrl(page, locale),
    title: page.kind === 'post' ? `~/blog/${page.post.slug}` : TITLES[page.kind],
    pageTitle: pageMeta(page, locale).title,
    content: content(page, locale, posts, background),
    ...placement(page, origin),
    origin,
  }
}

/** The windows a page stands for: a post sits on top of the blog list it was opened from. */
export function windowsForPage(
  page: Page | undefined,
  locale: Locale,
  posts: Post[]
): WindowConfig[] {
  if (!page || page.kind === 'home') return []
  if (page.kind === 'post')
    return [
      pageWindow({ kind: 'blog' }, locale, posts, undefined, true),
      pageWindow(page, locale, posts),
    ]
  return [pageWindow(page, locale, posts)]
}
