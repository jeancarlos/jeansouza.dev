import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as 'pt' | 'en')) {
    locale = routing.defaultLocale
  }
  const mod = (await import(`../../content/i18n/${locale}.json`)) as {
    default: Record<string, unknown>
  }
  return {
    locale,
    messages: mod.default,
  }
})
