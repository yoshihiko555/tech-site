import type { PostIndex } from '#shared/types/post'

/** All posts and terms. Prerendered pages carry it in their payload. */
export function usePostIndex() {
  return useFetch<PostIndex>('/api/posts', { key: 'post-index' })
}
