/**
 * NOW on the top page: what the owner is working on, with the date it was last written.
 * Update `updated` whenever the items change; a stale list reads worse than none.
 */
export interface NowItem {
  /** what kind of work (shown as a chip) */
  state: 'BUILDING' | 'LEARNING' | 'GROWING' | 'RUNNING'
  name: string
  text: string
  /** where to read more: a page on this site or an external URL */
  link?: { label: string; to: string }
}

export const NOW_UPDATED = '2026-11-04'

export const NOW: NowItem[] = [
  {
    state: 'BUILDING',
    name: 'orchex',
    text: 'AI 駆動開発を個人でもチームでも回せるように、Claude Code を指揮役にしたマルチエージェント基盤を作っています。',
    link: { label: 'CASE STUDY', to: '/works/orchex' },
  },
  {
    state: 'LEARNING',
    name: 'Harness Engineering',
    text: 'AI 駆動開発が個人でもチームでもうまく回るには、どんな仕組みを作ればいいのか。ハーネスエンジニアリングを中心に学んでいます。',
  },
  {
    state: 'GROWING',
    name: 'pi',
    text: 'coding agent の pi を、orchex とは別に、自分用のハーネスで育てています。',
  },
  {
    state: 'BUILDING',
    name: 'RAG',
    text: 'RAG など、AI をプロダクトに組み込む方法を学びながら、プロダクトを作っています。',
  },
  {
    state: 'RUNNING',
    name: 'Hermes',
    text: 'パーソナル AI として、自宅の Mac mini で Hermes Agent を常駐させています。部ごとに仕事の流れを持つ、1 台で動く小さな会社として育てています。',
  },
]
