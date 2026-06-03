import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, act } from '@testing-library/react'
import { LocalePersist } from './LocalePersist'

const STORAGE_KEY = 'locale'

vi.mock('next-intl', () => ({
  useLocale: () => 'pt',
}))

const replaceMock = vi.fn()
vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
  usePathname: () => '/',
}))

describe('LocalePersist', () => {
  beforeEach(() => {
    localStorage.clear()
    replaceMock.mockClear()
  })

  it('writes current locale to localStorage on mount', () => {
    render(<LocalePersist />)
    expect(localStorage.getItem(STORAGE_KEY)).toBe('pt')
  })

  it('redirects to stored locale when it differs from current', () => {
    localStorage.setItem(STORAGE_KEY, 'en')
    render(<LocalePersist />)
    expect(replaceMock).toHaveBeenCalledWith('/', { locale: 'en' })
  })

  it('does not redirect when stored locale matches current', () => {
    localStorage.setItem(STORAGE_KEY, 'pt')
    render(<LocalePersist />)
    expect(replaceMock).not.toHaveBeenCalled()
  })

  it('ignores invalid stored values', () => {
    localStorage.setItem(STORAGE_KEY, 'fr')
    render(<LocalePersist />)
    expect(replaceMock).not.toHaveBeenCalled()
    expect(localStorage.getItem(STORAGE_KEY)).toBe('pt')
  })
})
