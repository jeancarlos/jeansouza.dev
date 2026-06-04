import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Hero } from './index'
import { WindowManagerProvider } from '@/components/windows/WindowManager'

vi.mock('next-intl', () => ({
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

vi.mock('next/dynamic', () => ({
  default: () => () => <div data-testid="more-links" />,
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
})
