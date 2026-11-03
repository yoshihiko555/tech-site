import { AllPostsDocument, TaxonomyDocument } from '~~/generated/graphql'
import type { AllPostsQuery } from '~~/generated/graphql'
import type { PostIndex, PostMeta, Term, TermWithCount } from '#shared/types/post'

export type RawPost = NonNullable<NonNullable<AllPostsQuery['articlesCollection']>['items'][number]>
type RawTerm = { name?: string | null; slug?: string | null } | null | undefined

export interface PostRecord extends PostMeta {
  content: string
}

export interface PostStore extends PostIndex {
  records: PostRecord[]
}

const PAGE_SIZE = 25
let store: Promise<PostStore> | null = null

function toTerm(term: RawTerm): Term | null {
  if (!term?.slug) return null
  return { name: term.name ?? term.slug, slug: term.slug }
}

function toTerms(terms: RawTerm[]): Term[] {
  return terms.map(toTerm).filter((term): term is Term => term !== null)
}

/** A Contentful entry as a post, or null when it has no slug or title. */
export function toRecord(raw: RawPost): PostRecord | null {
  if (!raw.slug || !raw.title) return null
  const publishedAt = raw.sys.firstPublishedAt ?? raw.sys.publishedAt ?? ''
  return {
    slug: raw.slug,
    title: raw.title,
    description: raw.description ?? '',
    publishedAt,
    updatedAt: raw.sys.publishedAt ?? publishedAt,
    category: toTerm(raw.category),
    tags: toTerms(raw.tagsCollection?.items ?? []),
    thumbnail: raw.thumbnail?.url ? { url: raw.thumbnail.url, description: raw.thumbnail.description ?? '' } : null,
    content: raw.content ?? '',
  }
}

function withCounts(terms: Term[], records: PostRecord[], pick: (post: PostRecord) => Term[]): TermWithCount[] {
  return terms.map((term) => ({
    ...term,
    count: records.filter((post) => pick(post).some((t) => t.slug === term.slug)).length,
  }))
}

/**
 * Posts newest first, plus every category and tag with its post count.
 * Terms without posts are kept, so their pages still exist.
 */
export function buildPostStore(records: PostRecord[], categoryTerms: RawTerm[], tagTerms: RawTerm[]): PostStore {
  const sorted = [...records].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  const categories = withCounts(toTerms(categoryTerms), sorted, (post) => (post.category ? [post.category] : []))
  const tags = withCounts(toTerms(tagTerms), sorted, (post) => post.tags).sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name),
  )
  const posts = sorted.map(({ content: _content, ...meta }) => meta)
  return { records: sorted, posts, categories, tags }
}

/** Neighbours in a newest-first list: the older post comes after, the newer one before. */
export function selectNeighbours(posts: PostMeta[], index: number): { older: PostMeta | null; newer: PostMeta | null } {
  if (index < 0 || index >= posts.length) return { older: null, newer: null }
  return {
    older: posts[index + 1] ?? null,
    newer: index > 0 ? (posts[index - 1] ?? null) : null,
  }
}

/** Posts that share a tag or the category with `post`, newest first. */
export function selectRelated(posts: PostMeta[], post: PostMeta, limit: number): PostMeta[] {
  const tagSlugs = new Set(post.tags.map((tag) => tag.slug))
  const categorySlug = post.category?.slug
  return posts
    .filter((other) => other.slug !== post.slug)
    .filter(
      (other) =>
        other.tags.some((tag) => tagSlugs.has(tag.slug)) ||
        (categorySlug !== undefined && other.category?.slug === categorySlug),
    )
    .slice(0, Math.max(0, limit))
}

async function fetchStore(): Promise<PostStore> {
  const records: PostRecord[] = []
  for (let skip = 0; ; skip += PAGE_SIZE) {
    const data = await queryContentful(AllPostsDocument, { limit: PAGE_SIZE, skip })
    const page = data.articlesCollection
    for (const raw of page?.items ?? []) {
      const record = raw ? toRecord(raw) : null
      if (record) records.push(record)
    }
    if (!page || skip + PAGE_SIZE >= page.total) break
  }
  const taxonomy = await queryContentful(TaxonomyDocument, {})
  return buildPostStore(records, taxonomy.categoriesCollection?.items ?? [], taxonomy.tagsCollection?.items ?? [])
}

/** All posts and terms, fetched once per build (refetched on every call in dev). */
export function loadPosts(): Promise<PostStore> {
  if (import.meta.dev) return fetchStore()
  store ??= fetchStore()
  return store
}
