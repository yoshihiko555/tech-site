/**
 * Who runs the site: the copy on the top page (hero, STATUS, footer).
 * Taken from the approved prototype and the old About page. Keep it factual.
 */

/** first year as an engineer (LEVEL and YEARS count from here) */
export const SINCE = 2015

export const PROFILE = {
  name: 'YOSHIHIKO',
  role: 'Engineer / Creator',
  /** short stack line in the hero tags */
  stackLine: 'Go / TS / Vue',
  className: 'ENGINEER / CREATOR',
  mainQuest: 'AI engineering and a tech lead role',
  lede: 'Writing about AI agents, Claude Code and developer tooling.',
}

/** the hero status line cycles through these */
export const PHRASES = [
  'full-stack engineer',
  'heading to ai engineering',
  'writing about claude code',
  'go / typescript / vue',
  `building since ${SINCE}`,
]

/** one paragraph of the bio; `mark` parts are highlighted */
export type BioPart = { text: string; mark?: boolean }

export const BIO: BioPart[][] = [
  [
    { text: 'Full-stack leaning engineer who enjoys the whole process of making things. Heading toward ' },
    { text: 'AI engineering', mark: true },
    { text: ' and a tech lead role.' },
  ],
  [{ text: 'Lately building side projects in Go, and writing about AI agents, Claude Code and developer tooling.' }],
]

/** toolkit from the old About page, grouped (no skill levels) */
export const STACK: { group: string; items: string[] }[] = [
  { group: 'FRONTEND', items: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Vue', 'React'] },
  { group: 'BACKEND', items: ['Python', 'Go', 'Java', 'C#'] },
  { group: 'INFRA', items: ['Docker'] },
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
