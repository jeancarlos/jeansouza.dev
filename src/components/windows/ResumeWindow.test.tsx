import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LocaleProvider } from '../../i18n/react'
import { ResumeWindow } from './ResumeWindow'
import { profile } from '@/content/resume/profile'

describe('ResumeWindow', () => {
  it.each(['pt', 'en'] as const)('renders the resume in %s', (locale) => {
    render(
      <LocaleProvider locale={locale}>
        <ResumeWindow locale={locale} />
      </LocaleProvider>
    )
    expect(screen.getByText(profile.name)).toBeInTheDocument()
    expect(screen.getByText(profile.summary[locale])).toBeInTheDocument()
  })
})
