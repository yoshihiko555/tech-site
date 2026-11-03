import type { PostDetail, PostMeta } from '#shared/types/post'

const RELATED_LIMIT = 3

/** One post with its rendered body, outline, neighbours and related posts. */
export default defineEventHandler(async (event): Promise<PostDetail> => {
  const slug = getRouterParam(event, 'slug')
  const { records, posts } = await loadPosts()
  const index = records.findIndex((post) => post.slug === slug)
  const record = records[index]
  if (!record) {
    throw createError({ statusCode: 404, statusMessage: `Post not found: ${slug}` })
  }

  const { origin } = useRuntimeConfig().public
  const { html, headings, readingMinutes } = await renderPost(record.content, origin)
  const { content: _content, ...meta } = record

  // posts are newest first, so the next index is the older post
  const older: PostMeta | null = posts[index + 1] ?? null
  const newer: PostMeta | null = index > 0 ? (posts[index - 1] ?? null) : null

  const tagSlugs = new Set(meta.tags.map((tag) => tag.slug))
  const related = posts
    .filter((post) => post.slug !== meta.slug)
    .filter((post) => post.tags.some((tag) => tagSlugs.has(tag.slug)) || post.category?.slug === meta.category?.slug)
    .slice(0, RELATED_LIMIT)

  return { ...meta, html, headings, readingMinutes, older, newer, related }
})
