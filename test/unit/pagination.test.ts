import { describe, expect, it } from 'vitest'
import { countPages, pagePath, parsePageParam, POSTS_PER_PAGE, slicePage } from '../../app/utils/pagination'

const items = Array.from({ length: 24 }, (_, i) => i + 1)

describe('countPages', () => {
  it('keeps one page even when there are no posts', () => {
    expect(countPages(0)).toBe(1)
  })

  it('rounds up so a partial page still counts', () => {
    expect(countPages(POSTS_PER_PAGE)).toBe(1)
    expect(countPages(POSTS_PER_PAGE + 1)).toBe(2)
    expect(countPages(24)).toBe(3)
  })
})

describe('slicePage', () => {
  it('returns the eight posts of the requested page', () => {
    expect(slicePage(items, 1)).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
    expect(slicePage(items, 3)).toEqual([17, 18, 19, 20, 21, 22, 23, 24])
  })

  it('returns nothing past the last page', () => {
    expect(slicePage(items, 4)).toEqual([])
  })
})

describe('pagePath', () => {
  it('serves page 1 at the base path, as the old site did', () => {
    expect(pagePath('/blog', 1)).toBe('/blog')
    expect(pagePath('/tags/llm', 0)).toBe('/tags/llm')
  })

  it('puts later pages under /page/<n>', () => {
    expect(pagePath('/blog', 2)).toBe('/blog/page/2')
    expect(pagePath('/categories/ai', 3)).toBe('/categories/ai/page/3')
  })
})

describe('parsePageParam', () => {
  it('accepts positive whole numbers', () => {
    expect(parsePageParam('1')).toBe(1)
    expect(parsePageParam('12')).toBe(12)
  })

  it('takes the first value when the param repeats', () => {
    expect(parsePageParam(['3', '4'])).toBe(3)
  })

  it.each([['0'], ['-1'], ['1.5'], ['abc'], [''], [undefined]])('rejects %j', (raw) => {
    expect(parsePageParam(raw)).toBeNull()
  })
})
