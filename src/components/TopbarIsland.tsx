import { LocaleProvider } from '../i18n/react'
import { Topbar } from './layout/Topbar'

/**
 * Astro renders each island in isolation, so context does not reach across
 * component boundaries. Topbar reads the locale from context, so it gets its
 * own provider here.
 */
export function TopbarIsland({ locale }: { locale: 'pt' | 'en' }) {
  return (
    <LocaleProvider locale={locale}>
      <Topbar />
    </LocaleProvider>
  )
}
