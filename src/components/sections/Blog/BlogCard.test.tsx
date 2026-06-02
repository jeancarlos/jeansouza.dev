import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BlogCard } from './BlogCard'
import type { PostMeta } from '@/lib/posts'

vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

const mockPost: PostMeta = {
  slug: 'test-post',
  title: 'Test Post',
  date: '2026-01-01',
  description: 'A test description',
  locale: 'pt',
}

describe('BlogCard', () => {
  it('renders the post title', () => {
    render(<BlogCard post={mockPost} />)
    expect(screen.getByText('Test Post')).toBeInTheDocument()
  })

  it('renders the post date', () => {
    render(<BlogCard post={mockPost} />)
    expect(screen.getByText(/2026/)).toBeInTheDocument()
  })

  it('links to the post slug', () => {
    render(<BlogCard post={mockPost} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', expect.stringContaining('test-post'))
  })
})
