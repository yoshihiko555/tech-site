/**
 * Case study pages (/works/:slug). The body is server/assets/works/:slug.md;
 * this holds the header. Numbers are as of `asOf`: update both together.
 */
export interface CaseStudy {
  slug: string
  name: string
  title: string
  lede: string
  asOf: string
  facts: { label: string; value: string }[]
  source: string
  /** preview image under public/ (also the share image) */
  image: string
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'orchex',
    name: 'orchex',
    title: 'Claude Code を指揮役にした、マルチエージェント開発の基盤',
    lede: 'Codex CLI や Antigravity CLI と役割を分けて開発を進めるために、エージェント・スキル・hook・設定をまとめて配る仕組みを一人で作り続けています。',
    asOf: '2026-11-03',
    facts: [
      { label: 'PERIOD', value: '2026.02 – NOW' },
      { label: 'ROLE', value: 'SOLO' },
      { label: 'STACK', value: 'Python / Claude Code / Codex CLI / Antigravity CLI' },
      { label: 'COMMITS', value: '583' },
      { label: 'LATEST', value: 'v0.3.7' },
      { label: 'ADRS', value: '63' },
    ],
    source: 'https://github.com/yoshihiko555/ai-orchestra',
    image: '/works/orchex.png',
  },
]

export function findCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((study) => study.slug === slug)
}
