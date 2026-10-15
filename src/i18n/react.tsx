import { createContext, useContext, type ReactNode } from 'react'
import { translator, type Locale } from './t'

const LocaleContext = createContext<Locale>('pt')

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}

export function useLocale(): Locale {
  return useContext(LocaleContext)
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (whole, name: string) =>
    name in vars ? String(vars[name]) : whole
  )
}

export function useTranslations(namespace?: string) {
  const locale = useContext(LocaleContext)
  const t = translator(locale)
  return (key: string, vars?: Record<string, string | number>): string =>
    interpolate(t(namespace ? `${namespace}.${key}` : key), vars)
}
