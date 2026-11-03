import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { TaxonomyDocument } from '../../generated/graphql'

// queryContentful uses Nuxt server auto-imports; stand them in for these tests.
const fetchMock = vi.fn()
let config = { ctfEndpoint: 'https://graphql.contentful.com/content/v1/spaces/x', ctfCdaToken: 'token' }

beforeEach(() => {
  vi.stubGlobal('useRuntimeConfig', () => config)
  vi.stubGlobal('$fetch', fetchMock)
  vi.stubGlobal('createError', (input: { statusCode: number; statusMessage: string }) =>
    Object.assign(new Error(input.statusMessage), input),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  fetchMock.mockReset()
  config = { ctfEndpoint: 'https://graphql.contentful.com/content/v1/spaces/x', ctfCdaToken: 'token' }
})

async function query() {
  const { queryContentful } = await import('../../server/utils/contentful')
  return queryContentful(TaxonomyDocument, {})
}

describe('queryContentful', () => {
  it('sends the query with the token and returns the data', async () => {
    fetchMock.mockResolvedValue({ data: { tagsCollection: { items: [] } } })
    await expect(query()).resolves.toEqual({ tagsCollection: { items: [] } })
    const [url, options] = fetchMock.mock.calls[0]!
    expect(url).toBe(config.ctfEndpoint)
    expect(options.headers).toEqual({ Authorization: 'Bearer token' })
    expect(options.body.query).toContain('query Taxonomy')
  })

  it('keeps going with a warning when Contentful returns data and errors', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    fetchMock.mockResolvedValue({
      data: { tagsCollection: { items: [null, { name: 'llm', slug: 'llm' }] } },
      errors: [{ message: 'Link to entry "abc" on field "tags" within type "Articles" cannot be resolved' }],
    })
    await expect(query()).resolves.toEqual({ tagsCollection: { items: [null, { name: 'llm', slug: 'llm' }] } })
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('cannot be resolved'))
  })

  it('fails when there is no data', async () => {
    fetchMock.mockResolvedValue({
      data: null,
      errors: [{ message: 'Query cannot be executed. The maximum allowed complexity for a query is 11000' }],
    })
    await expect(query()).rejects.toMatchObject({
      statusCode: 502,
      message: expect.stringContaining('maximum allowed complexity'),
    })
  })

  it('fails before sending anything when it is not configured', async () => {
    config = { ctfEndpoint: '', ctfCdaToken: '' }
    await expect(query()).rejects.toMatchObject({ statusCode: 500 })
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
