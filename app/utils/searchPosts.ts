import type { PostMeta } from '#shared/types/post'

/** Posts whose title, tags or category contain the query (any case). All posts for an empty query. */
export function searchPosts(posts: PostMeta[], query: string): PostMeta[] {
  const term = query.trim().toLowerCase()
  if (!term) return posts
  return posts.filter((post) =>
    [post.title, ...post.tags.map((tag) => tag.name), post.category?.name ?? ''].join(' ').toLowerCase().includes(term),
  )
}
