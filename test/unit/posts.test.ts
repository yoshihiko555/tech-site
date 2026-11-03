import { describe, expect, it } from 'vitest'
import { buildPostStore, selectNeighbours, selectRelated, toRecord } from '../../server/utils/posts'
import type { PostRecord, RawPost } from '../../server/utils/posts'
import type { PostMeta } from '../../shared/types/post'

function raw(overrides: Partial<RawPost> = {}): RawPost {
  return {
    sys: { id: '1', firstPublishedAt: '2026-03-22T00:00:00Z', publishedAt: '2026-03-25T00:00:00Z' },
    title: 'Title',
    slug: 'slug',
    description: 'desc',
    content: 'body',
    thumbnail: null,
    category: { name: 'AI', slug: 'ai' },
    tagsCollection: { items: [{ name: 'LLM', slug: 'llm' }] },
    ...overrides,
  } as RawPost
}

function post(slug: string, publishedAt: string, category: string | null, tags: string[]): PostRecord {
  return {
    slug,
    title: slug,
    description: '',
    publishedAt,
    updatedAt: publishedAt,
    category: category ? { name: category, slug: category } : null,
    tags: tags.map((tag) => ({ name: tag, slug: tag })),
    thumbnail: null,
    content: `content of ${slug}`,
  }
}

const meta = ({ content: _content, ...rest }: PostRecord): PostMeta => rest

describe('toRecord', () => {
  it('maps a Contentful entry to a post', () => {
    expect(toRecord(raw())).toEqual({
      slug: 'slug',
      title: 'Title',
      description: 'desc',
      publishedAt: '2026-03-22T00:00:00Z',
      updatedAt: '2026-03-25T00:00:00Z',
      category: { name: 'AI', slug: 'ai' },
      tags: [{ name: 'LLM', slug: 'llm' }],
      thumbnail: null,
      content: 'body',
    })
  })

  it('skips entries without a slug or a title', () => {
    expect(toRecord(raw({ slug: null }))).toBeNull()
    expect(toRecord(raw({ title: '' }))).toBeNull()
  })

  it('uses the last publish date when the first one is missing', () => {
    const record = toRecord(raw({ sys: { id: '1', firstPublishedAt: null, publishedAt: '2026-01-02T00:00:00Z' } }))
    expect(record?.publishedAt).toBe('2026-01-02T00:00:00Z')
  })

  it('drops tags without a slug and fills empty fields', () => {
    const record = toRecord(
      raw({
        description: null,
        content: null,
        category: null,
        thumbnail: { url: '//images.ctfassets.net/a.png', description: null },
        tagsCollection: { items: [null, { name: 'git', slug: 'git' }, { name: 'broken', slug: null }] },
      }),
    )
    expect(record).toMatchObject({
      description: '',
      content: '',
      category: null,
      thumbnail: { url: '//images.ctfassets.net/a.png', description: '' },
      tags: [{ name: 'git', slug: 'git' }],
    })
  })
})

describe('buildPostStore', () => {
  const records = [
    post('old', '2021-09-12T00:00:00Z', 'lifestyle', ['notion']),
    post('new', '2026-05-07T00:00:00Z', 'ai', ['llm', 'opencode']),
    post('mid', '2026-03-22T00:00:00Z', 'ai', ['llm']),
  ]
  const store = buildPostStore(
    records,
    [
      { name: 'AI', slug: 'ai' },
      { name: 'Lifestyle', slug: 'lifestyle' },
      { name: 'Empty', slug: 'empty' },
    ],
    [
      { name: 'notion', slug: 'notion' },
      { name: 'llm', slug: 'llm' },
      { name: 'opencode', slug: 'opencode' },
      { name: 'takt', slug: 'takt' },
    ],
  )

  it('lists posts newest first, without their bodies', () => {
    expect(store.posts.map((p) => p.slug)).toEqual(['new', 'mid', 'old'])
    expect(store.posts[0]).not.toHaveProperty('content')
    expect(store.records.map((p) => p.slug)).toEqual(['new', 'mid', 'old'])
  })

  it('counts posts per category and keeps empty ones', () => {
    expect(store.categories).toEqual([
      { name: 'AI', slug: 'ai', count: 2 },
      { name: 'Lifestyle', slug: 'lifestyle', count: 1 },
      { name: 'Empty', slug: 'empty', count: 0 },
    ])
  })

  it('orders tags by count, then name, keeping tags without posts', () => {
    expect(store.tags.map((t) => `${t.slug}:${t.count}`)).toEqual(['llm:2', 'notion:1', 'opencode:1', 'takt:0'])
  })

  it('does not reorder the records it was given', () => {
    expect(records.map((p) => p.slug)).toEqual(['old', 'new', 'mid'])
  })
})

describe('selectNeighbours', () => {
  const posts = ['c', 'b', 'a'].map((slug, i) => meta(post(slug, `2026-0${3 - i}-01T00:00:00Z`, 'ai', [])))

  it('has no newer post for the newest one', () => {
    expect(selectNeighbours(posts, 0)).toEqual({ older: posts[1], newer: null })
  })

  it('has no older post for the oldest one', () => {
    expect(selectNeighbours(posts, 2)).toEqual({ older: null, newer: posts[1] })
  })

  it('returns both sides in the middle', () => {
    expect(selectNeighbours(posts, 1)).toEqual({ older: posts[2], newer: posts[0] })
  })

  it('returns nothing for an index outside the list', () => {
    expect(selectNeighbours(posts, -1)).toEqual({ older: null, newer: null })
    expect(selectNeighbours(posts, 3)).toEqual({ older: null, newer: null })
  })
})

describe('selectRelated', () => {
  const posts = [
    post('p1', '2026-05-01T00:00:00Z', 'ai', ['llm']),
    post('p2', '2026-04-01T00:00:00Z', 'programming', ['git']),
    post('p3', '2026-03-01T00:00:00Z', 'ai', []),
    post('p4', '2026-02-01T00:00:00Z', 'programming', ['llm']),
    post('p5', '2026-01-01T00:00:00Z', 'lifestyle', []),
    post('n1', '2025-02-01T00:00:00Z', null, []),
    post('n2', '2025-01-01T00:00:00Z', null, []),
  ].map(meta)

  it('picks posts sharing a tag or the category, newest first, never itself', () => {
    const self = posts[0]!
    expect(selectRelated(posts, self, 10).map((p) => p.slug)).toEqual(['p3', 'p4'])
  })

  it('stops at the limit', () => {
    const self = meta(post('x', '2026-06-01T00:00:00Z', 'ai', ['llm', 'git']))
    expect(selectRelated(posts, self, 3).map((p) => p.slug)).toEqual(['p1', 'p2', 'p3'])
    expect(selectRelated(posts, self, 0)).toEqual([])
  })

  it('does not treat two posts without a category as related', () => {
    const self = posts.find((p) => p.slug === 'n1')!
    expect(selectRelated(posts, self, 10)).toEqual([])
  })
})
