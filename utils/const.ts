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
  // icon: File
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
    period: 3,
    percent: 90,
    ...getIcon('html5'),
  },
  {
    name: 'CSS',
    period: 3,
    percent: 90,
    ...getIcon('css3'),
  },
  {
    name: 'SCSS',
    period: 2,
    percent: 50,
    ...getIcon('sass'),
  },
  {
    name: 'JavaScript',
    period: 3,
    percent: 90,
    ...getIcon('javascript'),
  },
  {
    name: 'jQuery',
    period: 3,
    percent: 90,
    ...getIcon('jquery'),
  },
  {
    name: 'Vue',
    period: 2,
    percent: 60,
    ...getIcon('vue'),
  },
  {
    name: 'React',
    period: 0.5,
    percent: 20,
    ...getIcon('react'),
  },
  {
    name: 'TypeScript',
    period: 0.5,
    percent: 20,
    ...getIcon('typescript'),
  },
  {
    name: 'Java',
    period: 2,
    percent: 50,
    ...getIcon('java'),
  },
  {
    name: 'Python',
    period: 2,
    percent: 40,
    ...getIcon('python'),
  },
  {
    name: 'Django',
    period: 2,
    percent: 40,
    ...getIcon('django'),
  },
  {
    name: 'Docker',
    period: 1.5,
    percent: 50,
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
    siteUrl: 'https://coopy.herokuapp.com/',
    sourceIcon: 'bxl-github',
    sourceUrl: 'https://github.com/shutotakizawa/coopy',
  },
  // Bandue
  {
    name: 'Bandue',
    description: 'ソーシャルネットワークサービス',
    img: '/works/bandue.webp',
    siteUrl: 'https://bandue.herokuapp.com/',
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
  // {
  //   name: 'Offbal',
  //   description: 'タスク管理サービス',
  //   img: '/works/offbal.png',
  //   siteUrl: 'https://offbal.herokuapp.com/',
  //   sourceIcon: 'bxl-github',
  //   sourceUrl: 'https://github.com/yoshihiko555/offbal',
  // },
]
