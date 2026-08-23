import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

// The locale lives in the filename suffix (`<slug>.<locale>.md`), not in the
// frontmatter, so it stays out of the schema. The default glob loader slugifies
// ids and would glue the suffix on as `...construipt`, which cannot be split
// back apart — generateId keeps the filename so `<slug>.<locale>` survives.
const blog = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/blog',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
  }),
})

export const collections = { blog }
