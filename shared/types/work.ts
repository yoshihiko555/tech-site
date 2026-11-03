import type { Heading } from './post'

/** The body of a case study page (/works/:slug), rendered from server/assets/works/:slug.md. */
export interface CaseStudyBody {
  slug: string
  html: string
  headings: Heading[]
  readingMinutes: number
}
