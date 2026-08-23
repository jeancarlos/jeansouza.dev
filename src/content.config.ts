import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

// The locale lives in the filename suffix (`<slug>.<locale>.md`), not in the
// frontmatter, so it stays out of the schema. Routes derive it from the id.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
  }),
})

export const collections = { blog }
