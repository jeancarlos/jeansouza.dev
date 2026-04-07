import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fs from 'fs'
import path from 'path'
import { getAllPosts, getPost, getAllSlugs, getAllPostsWithContent } from './posts'

const postsDir = path.join(process.cwd(), 'src/content/posts')
const testSlug = '__test-post-2026-01-01'
const testPath = path.join(postsDir, `${testSlug}.md`)

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
      expect(posts[i].date >= posts[i + 1].date).toBe(true)
    }
  })

  it('includes required fields for each post', () => {
    const posts = getAllPosts()
    const found = posts.find((p) => p.slug === testSlug)
    expect(found).toBeDefined()
    expect(found!.title).toBe('Test Post')
    expect(found!.date).toBe('2026-01-01')
    expect(found!.description).toBe('A test post for unit tests')
  })
})

describe('getPost', () => {
  it('returns post with html content', async () => {
    const post = await getPost(testSlug)
    expect(post.contentHtml).toContain('<h1>Hello</h1>')
    expect(post.contentHtml).toContain('Test content here.')
  })

  it('returns correct metadata', async () => {
    const post = await getPost(testSlug)
    expect(post.title).toBe('Test Post')
    expect(post.slug).toBe(testSlug)
  })
})

describe('getAllSlugs', () => {
  it('returns slugs for all .md files', () => {
    const slugs = getAllSlugs()
    expect(slugs).toContain(testSlug)
  })
})

describe('getAllPostsWithContent', () => {
  it('returns all posts with html content', async () => {
    const posts = await getAllPostsWithContent()
    const found = posts.find((p) => p.slug === testSlug)
    expect(found).toBeDefined()
    expect(found!.contentHtml).toContain('<h1>Hello</h1>')
  })
})
