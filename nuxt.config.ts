import { NuxtConfig } from '@nuxt/types'
import MarkdownIt from 'markdown-it'
import { truncate } from './plugins/utils'
import { client } from './utils/contentful'
import { IArticlesFields } from './generated/contentful'

/** サイト名 */
const siteName = 'Yoshihiko'
/** Description */
const desc = 'Yoshihiko tech siteです。技術ブログ兼ポートフォリオにもなっています。'

export default ():NuxtConfig => ({
  // srcDir: 'src/',
  head: {
    title: siteName,
    titleTemplate: `%s | ${siteName}`,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'format-detection', content: 'telephone=no' },
      { hid: 'description', name: 'description', content: desc },
      { hid: 'og:site_name', property: 'og:site_name', content: siteName },
      { hid: 'og:title', property: 'og:title', content: siteName },
      { hid: 'og:description', property: 'og:description', content: desc },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content: process.env.ORIGIN || 'http://localhost:3000' },
      { hid: 'og:image', property: 'og:image', content: `${process.env.ORIGIN}/ogp-default.jpeg` },
      { hid: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' },
      { hid: 'twitter:title', property: 'twitter:title', content: 'Yoshihiko' },
      { hid: 'twitter:site', property: 'twitter:site', content: '@yoshihiko5555' },
      { hid: 'twitter:description', property: 'twitter:description', content: desc },
      { hid: 'twitter:image', property: 'twitter:image', content: `${process.env.ORIGIN}/ogp-default.jpeg` },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', sizes: '180×180', href: '/apple-touch-icon.png'},
    ],
    htmlAttrs: {
      prefix: 'og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# website: http://ogp.me/ns/website#',
    }
  },
  css: [
    'vuesax/dist/vuesax.css',
    'boxicons/css/boxicons.min.css',
    '~/assets/scss/styles',
  ],
  styleResources: {
    scss: [
      '~/assets/scss/prepends.scss'
    ]
  },
  components: true,
  plugins: [
    '~/plugins/vuesax',
    '~/plugins/apollo',
    '~/plugins/prism',
    '~/plugins/utils',
    '~/plugins/markdown-it',
    {
      src: '~/plugins/vue-shortkey.ts',
      mode: 'client',
    },
  ],
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxt/image',
    '@nuxtjs/stylelint-module',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/composition-api/module',
    '@nuxtjs/google-fonts',
    '@nuxtjs/color-mode',
  ],
  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/style-resources',
    '@nuxtjs/apollo',
    '@nuxtjs/moment',
    '@nuxtjs/google-gtag',
    '@nuxtjs/feed',
    'nuxt-interpolation',
  ],
  pwa: {
    manifest: {
      name: 'yoshihiko',
      lang: 'ja'
    }
  },
  build: {
    parallel: true,
    cache: true,
    // hardSource: true,
  },
  router: {
    extendRoutes (routes, resolve) {
      // Blog一覧ページネーション
      routes.push({
        path: '/blog/page/:page',
        component: resolve(__dirname, 'pages/blog/index.vue'),
        name: 'blog-page',
      })

      // Categoryページネーション
      routes.push({
        path: '/categories/page/:page',
        component: resolve(__dirname, 'pages/categories/_slug.vue'),
        name: 'categories-page',
      })

      // Tagページネーション
      routes.push({
        path: '/tags/page/:page',
        component: resolve(__dirname, 'pages/tags/_slug.vue'),
        name: 'tags-page',
      })
    }
  },
  // *******************
  // DevServerの設定
  // *******************
  server: {
    host: '0.0.0.0',
  },
  watchers: {
    webpack: {
      poll: true,
      ignored: /node_modules/,
    }
  },
  // *******************
  // 環境変数の設定
  // *******************
  publicRuntimeConfig: {
    origin: process.env.ORIGIN || 'http://localhost:3000'
  },
  // *******************
  // 各モジュールの設定
  // *******************
  googleFonts: {
    families: {
      Roboto: [100, 400, 500],
      Inconsolata: [200, 500],
      'Noto+Sans+JP': [100, 400, 700, 900],
    },
    display: 'swap'
  },
  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: process.env.CTF_ENDPOINT,
        httpLinkOptions: {
          headers: {
            Authorization: `Bearer ${process.env.CTF_CDA_TOKEN}`
          }
        }
      }
      // default: '~/utils/apollop.config.ts'
      // default: {
      //   // GraphQL検証用エンドポイント
      //   // 参考記事：https://zenn.dev/kimkiyong/articles/b92b1029093741#reference
      //   // httpEndpoint: 'https://graphql-pokemon2.vercel.app/'
      // }
    }
  },
  // tailwindcss: {
  //   configPath: '~/config/tailwind.config.js',
  //   purgeCSSInDev: false,
  // }
  'google-gtag': {
    id: process.env.GTAG_ID
  },
  colorMode: {
    classSuffix: '',
  },
  feed: {
    path: '/feed.xml',
    async create (feed) {
      feed.options = {
        title: siteName,
        link: `${process.env.ORIGIN}/feed.xml`,
        description: desc,
        favicon: `${process.env.ORIGIN}/favicon.ico`,
        image: `${process.env.ORIGIN}/apple-touch-icon.png`
      }

      const md = new MarkdownIt({
        html: true,
        typographer: true,
      })

      const articles = await client().getEntries<IArticlesFields>({
        content_type: 'articles',
        order: '-sys.createdAt'
      })

      articles.items.forEach(article => {
        feed.addItem({
          id: article.fields.slug,
          title: article.fields.title,
          link: `${process.env.ORIGIN}/blog/${article.fields.slug}`,
          description: truncate(article.fields.content.replace(/\[\[toc\]\]\s/, '') || '', 60),
          content: md.render(article.fields.content),
          published: new Date(article.sys.createdAt),
          date: new Date(article.sys.updatedAt),
          image: `https:${article.fields.thumbnail.fields.file.url}`,
        })
      })

      feed.addCategory('blog')
      feed.addContributor({
        name: 'Yoshihiko',
        email: 'yoshihiko05410@gmail.com',
        link: process.env.ORIGIN
      })
    },
    cacheTime: 1000 * 60 * 15,
    type: 'rss2',
    // type: 'atom1',
  }
})
