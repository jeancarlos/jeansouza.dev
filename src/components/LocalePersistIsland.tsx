import { LocaleProvider } from '../i18n/react'
import { LocalePersist } from './i18n/LocalePersist'

/**
 * Remembers the reader's language choice and sends them back to it. Astro
 * renders islands in isolation, so this carries its own provider.
 */
export function LocalePersistIsland({ locale }: { locale: 'pt' | 'en' }) {
  return (
    <LocaleProvider locale={locale}>
      <LocalePersist />
    </LocaleProvider>
  )
}
