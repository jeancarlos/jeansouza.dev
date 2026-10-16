import { LANGUAGE_TAG, translator, type Locale } from '@/i18n/t'
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

function mainNodes(page: Page, locale: Locale, url: string): object[] {
  const inLanguage = LANGUAGE_TAG[locale]
  if (page.kind === 'home') {
    return [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url,
        name: profile.name,
        inLanguage,
        publisher: { '@id': PERSON_ID },
      },
      person(locale),
    ]
  }
  if (page.kind === 'resume') {
    return [{ '@type': 'ProfilePage', url, inLanguage, mainEntity: person(locale) }]
  }
  if (page.kind === 'post') {
    const { title, description } = pageMeta(page, locale)
    return [
      {
        '@type': 'BlogPosting',
        headline: page.post.title,
        name: title,
        description,
        url,
        mainEntityOfPage: url,
        inLanguage,
        datePublished: page.post.date,
        dateModified: page.post.date,
        author: person(locale),
        image: `${SITE_URL}${page.post.ogImage}`,
      },
    ]
  }
  return []
}

/** Home, then the page's section, then the post itself. */
function breadcrumbs(page: Page, locale: Locale, url: string): object[] {
  if (page.kind === 'home') return []
  const section = page.kind === 'post' ? 'blog' : page.kind
  const crumbs = [
    { name: profile.name, item: `${SITE_URL}${pageUrl({ kind: 'home' }, locale)}` },
    {
      name: translator(locale)(`meta.${section}.title`).split(' — ')[0],
      item: `${SITE_URL}${pageUrl({ kind: section }, locale)}`,
    },
    ...(page.kind === 'post' ? [{ name: page.post.title, item: url }] : []),
  ]
  return [
    {
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, ...c })),
    },
  ]
}

/** schema.org JSON-LD graph for a page. */
export function structuredData(page: Page, locale: Locale): object | undefined {
  const url = `${SITE_URL}${pageUrl(page, locale)}`
  const graph = [...mainNodes(page, locale, url), ...breadcrumbs(page, locale, url)]
  return graph.length ? { '@context': 'https://schema.org', '@graph': graph } : undefined
}
