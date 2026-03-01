// *********************
// サイトマップ
// *********************
export type SiteType = {
  id: string
  url: string
  title: string
}

export const SITE_MAPS: SiteType[] = [
  { id: 'home', url: '/', title: 'Home', },
  { id: 'about', url: '/about', title: 'About', },
  { id: 'blog', url: '/blog', title: 'Blog' },
  { id: 'works', url: '/works', title: 'Works' },
  // { id: 'contact', url: '/contact', title: 'Contact' },
]

// *********************
// 習得スキル
// *********************
export type SkillType = {
  name: string
  period: number
  percent: number
  light: File
  dark: File
}

/**
 * アイコンの取得
 * @param name
 * @returns
 */
const getIcon = (name: string): { light: File, dark: File } => ({
  light: require(`~/assets/img/icon/light/${name}.svg`),
  dark: require(`~/assets/img/icon/dark/${name}.svg`),
})

export const SKILLS: SkillType[] = [
  {
    name: 'HTML',
    period: 6,
    percent: 80,
    ...getIcon('html5'),
  },
  {
    name: 'CSS',
    period: 6,
    percent: 75,
    ...getIcon('css3'),
  },
  {
    name: 'JavaScript',
    period: 6,
    percent: 80,
    ...getIcon('javascript'),
  },
  {
    name: 'TypeScript',
    period: 3,
    percent: 70,
    ...getIcon('typescript'),
  },
  {
    name: 'Vue',
    period: 4,
    percent: 70,
    ...getIcon('vue'),
  },
  {
    name: 'React',
    period: 2,
    percent: 45,
    ...getIcon('react'),
  },
  {
    name: 'Python',
    period: 3,
    percent: 50,
    ...getIcon('python'),
  },
  {
    name: 'Go',
    period: 2,
    percent: 55,
    ...getIcon('go'),
  },
  {
    name: 'Java',
    period: 3,
    percent: 55,
    ...getIcon('java'),
  },
  {
    name: 'C#',
    period: 3,
    percent: 55,
    ...getIcon('c-sharp'),
  },
  {
    name: 'Docker',
    period: 2,
    percent: 55,
    ...getIcon('docker'),
  },
]

// *********************
// サイト設定
// *********************
export const SITE_THEME_COLOR = {
  LIGHT: '#90A4AE',
  DEFAULT: '#546E7A',
  DARK: '#263238',
}

// *********************
// ポートフォリオ
// *********************
export type WorkType = {
  name: string
  description: string
  img: string
  siteUrl: string
  sourceIcon: string
  sourceUrl: string
}

export const WORKS: WorkType[] = [
  // Coopy
  {
    name: 'Coopy',
    description: 'ブログサービス',
    img: '/works/coopy.webp',
    siteUrl: '',
    sourceIcon: 'bxl-github',
    sourceUrl: 'https://github.com/shutotakizawa/coopy',
  },
  // Bandue
  {
    name: 'Bandue',
    description: 'ソーシャルネットワークサービス',
    img: '/works/bandue.webp',
    siteUrl: '',
    sourceIcon: 'bxl-github',
    sourceUrl: 'https://github.com/shutotakizawa/bandue',
  },
  // Myunsplash
  {
    name: 'Myunsplash',
    description: 'お気に入り画像保存サービス',
    img: '/works/myunsplash.webp',
    siteUrl: 'https://myunsplash-49abd.web.app/',
    sourceIcon: 'bxl-github',
    sourceUrl: 'https://github.com/yoshihiko555/myunsplash',
  },
  // Offbal
  {
    name: 'Offbal',
    description: 'タスク管理サービス',
    img: '/works/offbal.png',
    siteUrl: '',
    sourceIcon: 'bxl-github',
    sourceUrl: 'https://github.com/yoshihiko555/offbal',
  },
  // Nudge
  {
    name: 'Nudge',
    description: 'Notion管理アプリ',
    img: '/works/nudge.png',
    siteUrl: '',
    sourceIcon: 'bxl-github',
    sourceUrl: 'https://github.com/yoshihiko555/Nudge',
  }
]
