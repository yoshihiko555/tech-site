/** USES on the top page: the tools written about in two posts (USES_SOURCES). */
export interface UseItem {
  name: string
  note?: string
}

export interface UseCard {
  title: string
  items: UseItem[]
  tone: 'dark' | 'warm' | 'teal' | 'mustard'
  /** how fast the card drifts against the scroll (negative moves up) */
  speed: number
}

export const USES: UseCard[] = [
  { title: 'TERMINAL', tone: 'dark', speed: -0.035, items: [{ name: 'WezTerm' }, { name: 'tmux' }] },
  {
    title: 'AI',
    tone: 'warm',
    speed: 0.04,
    items: [
      { name: 'Claude Code' },
      { name: 'Codex' },
      { name: 'ChatGPT' },
      { name: 'Gemini' },
      { name: 'NotebookLM' },
    ],
  },
  {
    title: 'CLI',
    tone: 'teal',
    speed: -0.02,
    items: [
      { name: 'git-worktree-runner', note: 'gtr' },
      { name: 'Baton', note: 'my own session TUI' },
      { name: 'fzf + ghq' },
      { name: 'lazygit' },
    ],
  },
  {
    title: 'MCP / PLUGINS',
    tone: 'mustard',
    speed: 0.03,
    items: [{ name: 'Context7' }, { name: 'Notion MCP' }, { name: 'claude-mem' }],
  },
  {
    title: 'VOICE & DESIGN',
    tone: 'dark',
    speed: -0.04,
    items: [{ name: 'Aqua Voice' }, { name: 'Pencil' }, { name: 'Adobe Creative Cloud' }],
  },
]

/** the posts the list comes from, with the short labels of the prototype */
export const USES_SOURCES: { slug: string; label: string }[] = [
  { slug: 'claude-code-dev-toolchain', label: 'Claude Code開発を支える私のツールチェイン' },
  { slug: 'engineer-ai-daily-workflow', label: '1人のエンジニアがAIを日常にどう組み込んでいるか' },
]
