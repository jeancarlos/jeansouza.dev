import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LocaleProvider } from '../../i18n/react'
import { LanguageNotice } from './LanguageNotice'
import type { Locale } from '@/i18n/t'

const hrefFor = (l: Locale) => `/${l}/blog/post/`

function show(page: Locale, browser: string, available: Locale[] = ['pt', 'en']) {
  vi.spyOn(navigator, 'language', 'get').mockReturnValue(browser)
  return render(
    <LocaleProvider locale={page}>
      <LanguageNotice available={available} hrefFor={hrefFor} />
    </LocaleProvider>
  )
}

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
})

describe('LanguageNotice', () => {
  it('offers Portuguese to a Portuguese browser reading the English page', () => {
    show('en', 'pt-BR')
    expect(screen.getByRole('link', { name: 'Ler em português' })).toHaveAttribute(
      'href',
      '/pt/blog/post/'
    )
  })

  it('offers English to any other browser reading the Portuguese page', () => {
    show('pt', 'de-DE')
    expect(screen.getByRole('link', { name: 'Read in English' })).toHaveAttribute(
      'href',
      '/en/blog/post/'
    )
  })

  it('stays quiet when the page is already in the preferred language', () => {
    show('pt', 'pt-PT')
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('stays quiet when the other language version does not exist', () => {
    show('pt', 'en-US', ['pt'])
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('respects a language the reader already picked', () => {
    localStorage.setItem('locale', 'pt')
    show('pt', 'en-US')
    expect(screen.queryByRole('link')).toBeNull()
  })

  it('remembers the choice when the reader switches', async () => {
    show('pt', 'en-US')
    await userEvent.click(screen.getByRole('link', { name: 'Read in English' }))
    expect(localStorage.getItem('locale')).toBe('en')
  })

  it('keeps the current language when dismissed and hides itself', async () => {
    show('pt', 'en-US')
    await userEvent.click(screen.getByRole('button', { name: 'Keep reading in Portuguese' }))
    expect(localStorage.getItem('locale')).toBe('pt')
    expect(screen.queryByRole('link')).toBeNull()
  })
})
