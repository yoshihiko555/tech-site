import type { PostIndex } from '#shared/types/post'

/** Every post (without bodies), categories and tags. */
export default defineEventHandler(async (): Promise<PostIndex> => {
  const { posts, categories, tags } = await loadPosts()
  return { posts, categories, tags }
})
