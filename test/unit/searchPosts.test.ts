import { describe, expect, it } from 'vitest'
import type { PostMeta } from '../../shared/types/post'
import { searchPosts } from '../../app/utils/searchPosts'

function post(slug: string, title: string, tags: string[], category: string | null = null): PostMeta {
  return {
    slug,
    title,
    description: '',
    publishedAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    category: category ? { name: category, slug: category.toLowerCase() } : null,
    tags: tags.map((name) => ({ name, slug: name.toLowerCase() })),
    thumbnail: null,
  }
}

const POSTS = [
  post('harness', 'Claude Codeを覚醒させる「ハーネスエンジニアリング」', ['claude code', 'Harness Engineering'], 'AI'),
  post('lazygit', 'lazygit でコミットメッセージ自動生成', ['git', 'lazygit'], 'Programming'),
  post('notion', 'Notionのゴミ箱を一括削除する', ['Notion'], 'Lifestyle'),
]

describe('searchPosts', () => {
  it('returns every post for an empty or blank query', () => {
    expect(searchPosts(POSTS, '')).toHaveLength(3)
    expect(searchPosts(POSTS, '   ')).toHaveLength(3)
  })

  it('matches the title, including Japanese', () => {
    expect(searchPosts(POSTS, 'ハーネス').map((p) => p.slug)).toEqual(['harness'])
  })

  it('matches tags and the category without regard to case', () => {
    expect(searchPosts(POSTS, 'GIT').map((p) => p.slug)).toEqual(['lazygit'])
    expect(searchPosts(POSTS, 'lifestyle').map((p) => p.slug)).toEqual(['notion'])
  })

  it('returns nothing when no field matches', () => {
    expect(searchPosts(POSTS, 'kubernetes')).toEqual([])
  })
})
