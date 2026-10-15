import { getImage } from 'astro:assets'
import { getCollection } from 'astro:content'
import type { Locale } from '@/i18n/t'
import { COVER_SIZE } from './coverSize'
import { postsFor, type Post } from './posts'

export async function loadPosts(locale: Locale): Promise<Post[]> {
  const entries = await Promise.all(
    (await getCollection('blog')).map(async ({ id, body, data: { image, imageAlt, ...data } }) => {
      const [cover, og] = await Promise.all([
        getImage({ src: image, ...COVER_SIZE, widths: [820, 1640], fit: 'cover', format: 'webp' }),
        getImage({ src: image, width: 1200, height: 630, fit: 'cover', format: 'jpg' }),
      ])
      const coverImage = { src: cover.src, srcSet: cover.srcSet.attribute, alt: imageAlt }
      return { id, body, data: { ...data, cover: coverImage, ogImage: og.src } }
    })
  )
  return postsFor(entries, locale)
}
