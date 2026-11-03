/**
 * Who runs the site: the copy on the top page (hero, STATUS, footer).
 * Taken from the approved prototype and the old About page. Keep it factual.
 */

/** first year as an engineer (LEVEL and YEARS count from here) */
export const SINCE = 2019

export const PROFILE = {
  name: 'YOSHIHIKO',
  role: 'Engineer / Creator',
  /** short stack line in the hero tags */
  stackLine: 'Go / TS / AI',
  className: 'ENGINEER / CREATOR',
  mainQuest: 'AI engineering and a tech lead role',
  lede: 'Notes on software development, AI, and the tools I use.',
}

/** the hero status line cycles through these */
export const PHRASES = [
  'engineer',
  'heading to ai engineering',
  'exploring ai and developer tools',
  'go / typescript / ai',
  `building since ${SINCE}`,
]

/** one paragraph of the bio; `mark` parts are highlighted */
export type BioPart = { text: string; mark?: boolean }

export const BIO: BioPart[][] = [
  [
    { text: 'ものづくりの最初から最後までを楽しむエンジニアです。' },
    { text: 'AI エンジニアリング', mark: true },
    { text: 'とテックリードの役割を目指しています。' },
  ],
  [{ text: '最近は Go で個人開発をしながら、AI エージェントや Claude Code、開発ツールについて書いています。' }],
]

/** toolkit grouped by field (no skill levels) */
export const STACK: { group: string; items: string[] }[] = [
  { group: 'LANGUAGES', items: ['TypeScript', 'JavaScript', 'Go', 'Python', 'Swift', 'C#', 'Java'] },
  { group: 'FRONTEND', items: ['Vue.js', 'Nuxt.js', 'React', 'Next.js', 'HTML5', 'CSS3'] },
  { group: 'BACKEND & INFRA', items: ['Node.js', 'Django', '.NET', 'Docker', 'Nix', 'Git'] },
  { group: 'AI / ML', items: ['OpenAI', 'Anthropic', 'RAG', 'Local LLM', 'Hermes'] },
]

export const TRAITS = ['Builds things end to end', 'Breadth and curiosity', 'AI and automation', 'Eyes on the team']

export const PERKS = [
  'Ship small, validate fast',
  'Readable, maintainable code',
  'Work close to user value',
  'Help the team move forward',
]

/** the giant rows between the hero and STATUS (outline row second) */
export const GIANT_ROWS: string[][] = [
  ['ENGINEER', 'CREATOR', 'ENGINEER', 'CREATOR', 'ENGINEER'],
  ['AI AGENTS', 'CLAUDE CODE', 'DEVELOPER TOOLING', 'AI AGENTS'],
]

export const LINKS = {
  github: 'https://github.com/yoshihiko555',
  x: 'https://twitter.com/yoshihiko5555',
  rss: '/feed.xml',
}
