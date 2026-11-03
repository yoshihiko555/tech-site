export interface Term {
  name: string
  slug: string
}

export interface TermWithCount extends Term {
  count: number
}

export interface PostMeta {
  slug: string
  title: string
  description: string
  /** first publish date (ISO 8601) */
  publishedAt: string
  /** last update date (ISO 8601) */
  updatedAt: string
  category: Term | null
  tags: Term[]
  thumbnail: { url: string; description: string } | null
}

export interface Heading {
  level: 2 | 3
  id: string
  text: string
}

export interface PostDetail extends PostMeta {
  html: string
  headings: Heading[]
  /** minutes at 500 characters per minute, code blocks excluded */
  readingMinutes: number
  older: PostMeta | null
  newer: PostMeta | null
  related: PostMeta[]
}

export interface PostIndex {
  posts: PostMeta[]
  categories: TermWithCount[]
  tags: TermWithCount[]
}
