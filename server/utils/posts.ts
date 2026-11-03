import { AllPostsDocument, TaxonomyDocument } from '~~/generated/graphql'
import type { AllPostsQuery } from '~~/generated/graphql'
import type { PostIndex, PostMeta, Term, TermWithCount } from '#shared/types/post'

type RawPost = NonNullable<NonNullable<AllPostsQuery['articlesCollection']>['items'][number]>

export interface PostRecord extends PostMeta {
  content: string
}

interface PostStore extends PostIndex {
  records: PostRecord[]
}

const PAGE_SIZE = 25
let store: Promise<PostStore> | null = null

function toTerm(term: { name?: string | null; slug?: string | null } | null | undefined): Term | null {
  if (!term?.slug) return null
  return { name: term.name ?? term.slug, slug: term.slug }
}

function toRecord(raw: RawPost): PostRecord | null {
  if (!raw.slug || !raw.title) return null
  const publishedAt = raw.sys.firstPublishedAt ?? raw.sys.publishedAt ?? ''
  return {
    slug: raw.slug,
    title: raw.title,
    description: raw.description ?? '',
    publishedAt,
    updatedAt: raw.sys.publishedAt ?? publishedAt,
    category: toTerm(raw.category),
    tags: (raw.tagsCollection?.items ?? []).map(toTerm).filter((tag): tag is Term => tag !== null),
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
  records.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

  const taxonomy = await queryContentful(TaxonomyDocument, {})
  const categoryTerms = (taxonomy.categoriesCollection?.items ?? []).map(toTerm).filter((t): t is Term => t !== null)
  const tagTerms = (taxonomy.tagsCollection?.items ?? []).map(toTerm).filter((t): t is Term => t !== null)

  const categories = withCounts(categoryTerms, records, (post) => (post.category ? [post.category] : []))
  const tags = withCounts(tagTerms, records, (post) => post.tags).sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name),
  )

  const posts = records.map(({ content: _content, ...meta }) => meta)
  return { records, posts, categories, tags }
}

/** All posts and terms, fetched once per build (refetched on every call in dev). */
export function loadPosts(): Promise<PostStore> {
  if (import.meta.dev) return fetchStore()
  store ??= fetchStore()
  return store
}
