import type { PostMeta, TermWithCount } from '#shared/types/post'
import { formatDate } from './format'

export interface YearCount {
  year: number
  count: number
}

/** publish year in Japan time */
export function postYear(post: PostMeta): number {
  return Number(formatDate(post.publishedAt).slice(0, 4))
}

/** Posts per year from the oldest post's year to `lastYear`, empty years included. */
export function countByYear(posts: PostMeta[], lastYear: number): YearCount[] {
  const years = posts.map(postYear).filter((year) => year > 0)
  if (!years.length) return []
  const first = Math.min(...years)
  const last = Math.max(lastYear, ...years)
  return Array.from({ length: last - first + 1 }, (_, i) => {
    const year = first + i
    return { year, count: years.filter((y) => y === year).length }
  })
}

/** Tags used by the posts, most used first (ties by name). */
export function countTags(posts: PostMeta[]): TermWithCount[] {
  const counts = new Map<string, TermWithCount>()
  for (const tag of posts.flatMap((post) => post.tags)) {
    const entry = counts.get(tag.slug)
    if (entry) entry.count++
    else counts.set(tag.slug, { ...tag, count: 1 })
  }
  return [...counts.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

/** Calendar years from `since` to `year` (the LEVEL on the top page). */
export function yearsSince(since: number, year: number): number {
  return Math.max(0, year - since)
}
