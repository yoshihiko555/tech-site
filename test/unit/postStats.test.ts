import { describe, expect, it } from 'vitest'
import type { PostMeta } from '../../shared/types/post'
import { countByYear, countTags, postYear, yearsSince } from '../../app/utils/postStats'

function post(publishedAt: string, tags: string[] = []): PostMeta {
  return {
    slug: publishedAt,
    title: publishedAt,
    description: '',
    publishedAt,
    updatedAt: publishedAt,
    category: null,
    tags: tags.map((name) => ({ name, slug: name.toLowerCase() })),
    thumbnail: null,
  }
}

describe('postYear', () => {
  it('reads the year in Japan time', () => {
    // 2021-12-31 20:00 UTC is already 2022 in Tokyo
    expect(postYear(post('2021-12-31T20:00:00Z'))).toBe(2022)
  })
})

describe('countByYear', () => {
  it('keeps years without posts so the chart has no gaps', () => {
    const posts = [post('2026-05-07T00:00:00Z'), post('2026-01-10T00:00:00Z'), post('2021-11-12T00:00:00Z')]
    expect(countByYear(posts, 2026)).toEqual([
      { year: 2021, count: 1 },
      { year: 2022, count: 0 },
      { year: 2023, count: 0 },
      { year: 2024, count: 0 },
      { year: 2025, count: 0 },
      { year: 2026, count: 2 },
    ])
  })

  it('runs up to the given year even when nothing was posted yet', () => {
    expect(countByYear([post('2026-05-07T00:00:00Z')], 2027).map((y) => y.year)).toEqual([2026, 2027])
  })

  it('returns nothing without posts', () => {
    expect(countByYear([], 2026)).toEqual([])
  })
})

describe('countTags', () => {
  it('orders tags by use, then by name', () => {
    const posts = [post('2026-01-01T00:00:00Z', ['LLM', 'git']), post('2026-01-02T00:00:00Z', ['LLM', 'Docker'])]
    expect(countTags(posts)).toEqual([
      { name: 'LLM', slug: 'llm', count: 2 },
      { name: 'Docker', slug: 'docker', count: 1 },
      { name: 'git', slug: 'git', count: 1 },
    ])
  })
})

describe('yearsSince', () => {
  it('counts calendar years and never goes below zero', () => {
    expect(yearsSince(2015, 2026)).toBe(11)
    expect(yearsSince(2030, 2026)).toBe(0)
  })
})
