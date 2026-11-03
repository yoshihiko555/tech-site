/** USES on the top page: tools in daily use, with related posts in USES_SOURCES. */
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
  { title: 'TERMINAL', tone: 'dark', speed: -0.035, items: [{ name: 'Ghostty' }, { name: 'Herdr' }] },
  {
    title: 'AI',
    tone: 'warm',
    speed: 0.04,
    items: [
      { name: 'Claude Code' },
      { name: 'Codex' },
      { name: 'Antigravity' },
      { name: 'opencode' },
      { name: 'Hermes' },
      { name: 'Pi' },
      { name: 'Local LLM' },
    ],
  },
  {
    title: 'CLI',
    tone: 'teal',
    speed: -0.02,
    items: [
      { name: 'git-worktree-runner', note: 'gtr' },
      { name: 'fzf + ghq' },
      { name: 'lazygit' },
    ],
  },
  {
    title: 'DEV ENV',
    tone: 'mustard',
    speed: 0.03,
    items: [{ name: 'Nix' }, { name: 'mise' }, { name: 'OrbStack' }, { name: 'AeroSpace' }, { name: 'Neovim' }],
  },
  {
    title: 'VOICE & DESIGN',
    tone: 'dark',
    speed: -0.04,
    items: [{ name: 'Aqua Voice' }, { name: 'Pencil' }, { name: 'Adobe Creative Cloud' }],
  },
]

/** related posts about the toolchain and workflow */
export const USES_SOURCES: { slug: string; label: string }[] = [
  { slug: 'claude-code-dev-toolchain', label: 'Claude Code開発を支える私のツールチェイン' },
  { slug: 'engineer-ai-daily-workflow', label: '1人のエンジニアがAIを日常にどう組み込んでいるか' },
]
