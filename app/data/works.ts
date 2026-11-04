/** WORKS on the top page. */
export type WorkKind = 'side' | 'early'

export interface Work {
  name: string
  description: string
  /** side: a recent side project (counted in STATUS); early: from around 2020-2021 */
  kind: WorkKind
  stack: string[]
  /** live site, when there is one */
  site: string
  /** preview image under public/ */
  image: string
  source: string
  /** slug of its case study page (/works/:slug), when there is one */
  caseStudy?: string
}

export const WORK_KIND_LABEL: Record<WorkKind, string> = {
  side: 'SIDE PROJECT',
  early: 'EARLY WORK',
}

export const WORKS: Work[] = [
  {
    name: 'orchex',
    description: 'Multi-agent orchestration framework',
    kind: 'side',
    stack: ['Python', 'Claude Code', 'Codex', 'Antigravity'],
    site: '',
    image: '/works/orchex.png',
    source: 'https://github.com/yoshihiko555/ai-orchestra',
    caseStudy: 'orchex',
  },
  {
    name: 'Baton',
    description: 'AI coding session monitor',
    kind: 'side',
    stack: ['Go', 'bubbletea', 'tmux'],
    site: '',
    image: '/works/baton.jpg',
    source: 'https://github.com/yoshihiko555/baton',
  },
  {
    name: 'Nudge',
    description: 'Notion management app',
    kind: 'side',
    stack: ['Go', 'Wails', 'Notion'],
    site: '',
    image: '/works/nudge.jpg',
    source: 'https://github.com/yoshihiko555/Nudge',
  },
  {
    name: 'Offbal',
    description: 'Task management service',
    kind: 'early',
    stack: ['Vue.js', 'Django', 'MySQL', 'Docker'],
    site: '',
    image: '/works/offbal.jpg',
    source: 'https://github.com/yoshihiko555/offbal',
  },
  {
    name: 'Myunsplash',
    description: 'Favorite image collection service',
    kind: 'early',
    stack: ['React', 'TypeScript', 'Material-UI', 'Firebase'],
    site: 'https://myunsplash-49abd.web.app/',
    image: '/works/myunsplash.jpg',
    source: 'https://github.com/yoshihiko555/myunsplash',
  },
  {
    name: 'Bandue',
    description: 'Social network service',
    kind: 'early',
    stack: ['Vue.js', 'Django', 'Docker'],
    site: '',
    image: '/works/bandue.jpg',
    source: 'https://github.com/shutotakizawa/bandue',
  },
]

export function isSideProject(work: Work): boolean {
  return work.kind === 'side'
}
