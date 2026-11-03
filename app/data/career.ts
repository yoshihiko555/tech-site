/** EPISODES on the top page: the career so far, oldest first. */
export interface Episode {
  /** year, or NOW for the current one */
  when: string
  title: string
  /** false for the episode still in progress */
  done: boolean
}

export const EPISODES: Episode[] = [
  { when: '2015', title: 'Career begins', done: true },
  { when: '2019', title: 'Into web development', done: true },
  { when: '2022', title: 'Healthcare, finance and business systems', done: true },
  { when: '2024', title: 'Learning and prototyping with AI', done: true },
  { when: 'NOW', title: 'Next chapter in progress', done: false },
]
