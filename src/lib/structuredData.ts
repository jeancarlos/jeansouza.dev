import { LANGUAGE_TAG, type Locale } from '@/i18n/t'
import { profile } from '@/content/resume/profile'
import { SITE_URL, pageMeta, pageUrl, type Page } from './pages'

const PERSON_ID = `${SITE_URL}/#person`

const person = (locale: Locale) => ({
  '@type': 'Person',
  '@id': PERSON_ID,
  name: profile.name,
  url: SITE_URL,
  jobTitle: profile.headline[locale],
  sameAs: [
    `https://${profile.contacts.github}`,
    `https://www.${profile.contacts.linkedin}`,
    'https://bsky.app/profile/jeansouza.dev',
    'https://www.instagram.com/jeansouza.dev/',
  ],
})

/** schema.org JSON-LD for the pages that have a matching type; undefined elsewhere. */
export function structuredData(page: Page, locale: Locale): object | undefined {
  const url = `${SITE_URL}${pageUrl(page, locale)}`
  const inLanguage = LANGUAGE_TAG[locale]
  const context = 'https://schema.org'
  if (page.kind === 'home') {
    return {
      '@context': context,
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          url,
          name: profile.name,
          inLanguage,
          publisher: { '@id': PERSON_ID },
        },
        person(locale),
      ],
    }
  }
  if (page.kind === 'resume') {
    return {
      '@context': context,
      '@type': 'ProfilePage',
      url,
      inLanguage,
      mainEntity: person(locale),
    }
  }
  if (page.kind === 'post') {
    const { title, description } = pageMeta(page, locale)
    return {
      '@context': context,
      '@type': 'BlogPosting',
      headline: page.post.title,
      name: title,
      description,
      url,
      mainEntityOfPage: url,
      inLanguage,
      datePublished: page.post.date,
      author: person(locale),
      image: `${SITE_URL}${page.post.ogImage}`,
    }
  }
  return undefined
}
