/** WORKS on the top page (from the old Works page). */
export interface Work {
  name: string
  description: string
  /** only where the old About page lists it; a stack marks a side project */
  stack: string[]
  /** live site, when there is one */
  site: string
  /** screenshot under public/ (1200px wide JPEG) */
  image: string
  source: string
}

export const WORKS: Work[] = [
  {
    name: 'Baton',
    description: 'AI coding session monitor',
    stack: ['Go', 'bubbletea', 'tmux'],
    site: '',
    image: '/works/baton.jpg',
    source: 'https://github.com/yoshihiko555/baton',
  },
  {
    name: 'Nudge',
    description: 'Notion management app',
    stack: ['Go', 'Wails', 'Notion'],
    site: '',
    image: '/works/nudge.jpg',
    source: 'https://github.com/yoshihiko555/Nudge',
  },
  {
    name: 'Offbal',
    description: 'Task management service',
    stack: [],
    site: '',
    image: '/works/offbal.jpg',
    source: 'https://github.com/yoshihiko555/offbal',
  },
  {
    name: 'Myunsplash',
    description: 'Favorite image collection service',
    stack: [],
    site: 'https://myunsplash-49abd.web.app/',
    image: '/works/myunsplash.jpg',
    source: 'https://github.com/yoshihiko555/myunsplash',
  },
  {
    name: 'Bandue',
    description: 'Social network service',
    stack: [],
    site: '',
    image: '/works/bandue.jpg',
    source: 'https://github.com/shutotakizawa/bandue',
  },
  {
    name: 'Coopy',
    description: 'Blog service',
    stack: [],
    site: '',
    image: '/works/coopy.jpg',
    source: 'https://github.com/shutotakizawa/coopy',
  },
]

export function isSideProject(work: Work): boolean {
  return work.stack.length > 0
}
