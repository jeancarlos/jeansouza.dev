import { getAllPostsWithContent } from '@/lib/posts'
import { HomeClient } from '@/components/HomeClient'

export default async function HomePage() {
  const posts = await getAllPostsWithContent()
  return <HomeClient posts={posts} />
}
