import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { Hero } from './index'
import { WindowManagerProvider } from '@/components/windows/WindowManager'

vi.mock('@/i18n/react', () => ({
  LocaleProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useLocale: () => 'en',
  useTranslations: (namespace: string) => {
    const messages: Record<string, Record<string, string>> = {
      hero: { prompt: 'jean souza', role: 'role', cta: 'cta' },
      nav: { blog: 'Blog', resume: 'Resume' },
      resume: { title: 'Resume' },
      more: { title: 'More links' },
    }
    const ns = messages[namespace] ?? {}
    return (key: string) => ns[key]
  },
}))

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => '/',
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
    span: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
      <span {...props}>{children}</span>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  steps: () => undefined,
  useDragControls: () => ({ start: vi.fn() }),
}))

function renderHero() {
  return render(
    <WindowManagerProvider>
      <Hero locale="pt" onOpenBlog={() => {}} />
    </WindowManagerProvider>
  )
}

describe('Hero', () => {
  it('renders the terminal prompt character', () => {
    renderHero()
    expect(screen.getByText('>')).toBeInTheDocument()
  })

  it('renders the GitHub and LinkedIn links', () => {
    renderHero()
    expect(screen.getByText('GitHub')).toBeInTheDocument()
    expect(screen.getByText('LinkedIn')).toBeInTheDocument()
  })

  it('renders the more links button', () => {
    renderHero()
    expect(screen.getByLabelText('More links')).toBeInTheDocument()
  })

  it('links each window button to its page so crawlers and new tabs reach it', () => {
    renderHero()
    expect(screen.getByRole('link', { name: /Resume/ })).toHaveAttribute('href', '/pt/resume/')
    expect(screen.getByRole('link', { name: /Blog/ })).toHaveAttribute('href', '/pt/blog/')
    expect(screen.getByRole('link', { name: 'More links' })).toHaveAttribute('href', '/pt/more/')
  })

  it('keeps internal window links in the same tab', () => {
    renderHero()
    expect(screen.getByRole('link', { name: /Resume/ })).not.toHaveAttribute('target')
  })

  it('opens the window in place on a plain click instead of navigating', () => {
    renderHero()
    for (const name of [/Resume/, /Blog/, 'More links']) {
      expect(fireEvent.click(screen.getByRole('link', { name }))).toBe(false)
    }
  })

  it('leaves modified clicks to the browser so they open a new tab', () => {
    renderHero()
    const link = screen.getByRole('link', { name: /Blog/ })
    expect(fireEvent.click(link, { ctrlKey: true })).toBe(true)
    expect(fireEvent.click(link, { metaKey: true })).toBe(true)
    expect(fireEvent.click(link, { shiftKey: true })).toBe(true)
  })
})
