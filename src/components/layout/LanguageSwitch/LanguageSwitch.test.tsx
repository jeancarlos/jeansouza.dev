import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LanguageSwitch } from './index'

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => '/pt/',
}))

vi.mock('next-intl', () => ({
  useLocale: () => 'pt',
}))

describe('LanguageSwitch', () => {
  it('shows the opposite locale as the switch label', () => {
    render(<LanguageSwitch />)
    expect(screen.getByRole('button', { name: /EN/i })).toBeInTheDocument()
  })
})
