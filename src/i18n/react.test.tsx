import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LocaleProvider, useTranslations } from './react'

function Probe({ ns, k, vars }: { ns?: string; k: string; vars?: Record<string, string> }) {
  const t = useTranslations(ns)
  return <span>{t(k, vars)}</span>
}

describe('useTranslations shim', () => {
  it('resolves a namespaced key for the provided locale', () => {
    render(
      <LocaleProvider locale="en">
        <Probe ns="windows" k="resume" />
      </LocaleProvider>,
    )
    expect(screen.getByText('Resume')).toBeInTheDocument()
  })

  it('resolves the same key differently per locale', () => {
    render(
      <LocaleProvider locale="pt">
        <Probe ns="windows" k="resume" />
      </LocaleProvider>,
    )
    expect(screen.getByText('Currículo')).toBeInTheDocument()
  })

  it('interpolates named placeholders the way next-intl does', () => {
    render(
      <LocaleProvider locale="pt">
        <Probe ns="more" k="copy" vars={{ name: 'GitHub' }} />
      </LocaleProvider>,
    )
    expect(screen.getByText('Copiar GitHub')).toBeInTheDocument()
  })
})
