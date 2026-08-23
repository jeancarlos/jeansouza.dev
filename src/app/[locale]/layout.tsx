import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { LocalePersist } from '@/components/i18n/LocalePersist'
import { LocaleProvider } from '@/i18n/react'
import { Topbar } from '@/components/layout/Topbar'

interface Props {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'pt' | 'en')) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      {/* Components now read the framework-free shim; Next keeps its own
          provider until cutover so server components still resolve. */}
      <LocaleProvider locale={locale as 'pt' | 'en'}>
        <LocalePersist />
        <Topbar />
        {children}
      </LocaleProvider>
    </NextIntlClientProvider>
  )
}
