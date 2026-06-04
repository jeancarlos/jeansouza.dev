import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fs from 'fs'
import path from 'path'
import { getAllPosts, getPost, getAllSlugs, getAllPostsWithContent } from './posts'

const postsDir = path.join(process.cwd(), 'src/content/posts')
const testSlug = '__test-post-2026-01-01'
const testPath = path.join(postsDir, `${testSlug}.pt.md`)

beforeAll(() => {
  fs.writeFileSync(
    testPath,
    `---
title: Test Post
date: 2026-01-01
description: A test post for unit tests
---

# Hello

Test content here.
`
  )
})

afterAll(() => {
  fs.unlinkSync(testPath)
})

describe('getAllPosts', () => {
  it('returns posts sorted by date descending', () => {
    const posts = getAllPosts()
    for (let i = 0; i < posts.length - 1; i++) {
      expect(posts[i]?.date >= posts[i + 1]?.date).toBe(true)
    }
  })

  it('includes required fields for each post', () => {
    const posts = getAllPosts()
    const found = posts.find((p) => p.slug === testSlug)
    expect(found?.title).toBe('Test Post')
    expect(found?.date).toBe('2026-01-01')
    expect(found?.description).toBe('A test post for unit tests')
  })
})

describe('getPost', () => {
  it('returns post with raw markdown content', () => {
    const post = getPost(testSlug)
    expect(post?.content).toContain('# Hello')
    expect(post?.content).toContain('Test content here.')
  })

  it('returns correct metadata', () => {
    const post = getPost(testSlug)
    expect(post?.title).toBe('Test Post')
    expect(post?.slug).toBe(testSlug)
  })
})

describe('getAllSlugs', () => {
  it('returns slugs for all .md files', () => {
    const slugs = getAllSlugs()
    expect(slugs).toContain(testSlug)
  })
})

describe('getAllPostsWithContent', () => {
  it('returns all posts with content', () => {
    const posts = getAllPostsWithContent()
    const found = posts.find((p) => p.slug === testSlug)
    expect(found?.content).toContain('# Hello')
  })
})

describe('bilingual posts', () => {
  const testBase = '__test-bilingual-2026-01-01'

  beforeAll(() => {
    fs.writeFileSync(
      path.join(postsDir, `${testBase}.pt.md`),
      `---
title: Teste PT
date: 2026-01-01
description: Descrição em português
---
Conteúdo em português.`
    )
    fs.writeFileSync(
      path.join(postsDir, `${testBase}.en.md`),
      `---
title: Test EN
date: 2026-01-01
description: English description
---
English content.`
    )
  })

  afterAll(() => {
    fs.unlinkSync(path.join(postsDir, `${testBase}.pt.md`))
    fs.unlinkSync(path.join(postsDir, `${testBase}.en.md`))
  })

  it('returns PT variant for pt locale', () => {
    const posts = getAllPosts('pt')
    const post = posts.find((p) => p.slug === testBase)
    expect(post?.title).toBe('Teste PT')
  })

  it('returns EN variant for en locale', () => {
    const posts = getAllPosts('en')
    const post = posts.find((p) => p.slug === testBase)
    expect(post?.title).toBe('Test EN')
  })

  it('falls back to available variant when locale missing', () => {
    const enOnlyBase = '__test-en-only-2026-01-01'
    fs.writeFileSync(
      path.join(postsDir, `${enOnlyBase}.en.md`),
      `---
title: EN Only
date: 2026-01-01
description: Only English
---
Only English content.`
    )
    const posts = getAllPosts('pt')
    const post = posts.find((p) => p.slug === enOnlyBase)
    expect(post?.title).toBe('EN Only')
    fs.unlinkSync(path.join(postsDir, `${enOnlyBase}.en.md`))
  })
})
