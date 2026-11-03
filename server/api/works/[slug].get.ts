import type { CaseStudyBody } from '#shared/types/work'

const SLUG = /^[a-z0-9-]+$/

/** A case study body: server/assets/works/:slug.md, rendered like a post. */
export default defineEventHandler(async (event): Promise<CaseStudyBody> => {
  const slug = getRouterParam(event, 'slug') ?? ''
  const source = SLUG.test(slug) ? await useStorage('assets:server').getItem(`works:${slug}.md`) : null
  if (typeof source !== 'string') {
    throw createError({ statusCode: 404, statusMessage: `Case study not found: ${slug}` })
  }

  const { origin } = useRuntimeConfig().public
  const { html, headings, readingMinutes } = await renderPost(source, origin)
  return { slug, html, headings, readingMinutes }
})
