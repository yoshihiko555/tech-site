import type { PostDetail } from '#shared/types/post'

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
  const { older, newer } = selectNeighbours(posts, index)
  const related = selectRelated(posts, meta, RELATED_LIMIT)

  return { ...meta, html, headings, readingMinutes, older, newer, related }
})
