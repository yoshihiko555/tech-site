/**
 * NOW on the top page: what the owner is working on, with the date it was last written.
 * Update `updated` whenever the items change; a stale list reads worse than none.
 */
export interface NowItem {
  /** what kind of work (shown as a chip) */
  state: 'BUILDING' | 'WRITING' | 'SHIPPED'
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
    text: 'Claude Code を指揮役に、Codex CLI や Antigravity CLI を組み合わせて開発を進めるマルチエージェント基盤を育てています。',
    link: { label: 'SOURCE', to: 'https://github.com/yoshihiko555/ai-orchestra' },
  },
  {
    state: 'BUILDING',
    name: 'Baton',
    text: 'tmux の中で動く Claude Code や Codex のセッションをまとめて見守る TUI を、Go で作っています。',
    link: { label: 'SOURCE', to: 'https://github.com/yoshihiko555/baton' },
  },
  {
    state: 'WRITING',
    name: 'Dev Env',
    text: 'dotfiles と Nix、Ghostty と herdr、worktree ごとのリバースプロキシなど、AI エージェントと並んで開発するための環境づくりを書いています。',
    link: { label: 'READ', to: '/categories/dev-env' },
  },
  {
    state: 'SHIPPED',
    name: 'yoshihiko.tech',
    text: 'このサイトを Nuxt 2 から Nuxt 4 に移し、デザインも作り直しました。',
  },
]
