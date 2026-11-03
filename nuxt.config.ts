// https://nuxt.com/docs/api/configuration/nuxt-config
import { OGP_DEFAULT_IMAGE } from './shared/ogp'

const SITE_NAME = 'Yoshihiko'
const SITE_DESCRIPTION = 'Yoshihiko tech siteです。技術ブログ兼ポートフォリオにもなっています。'
const ORIGIN = process.env.ORIGIN || 'https://yoshihiko.tech'

export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: true },

  modules: ['@nuxt/eslint', '@nuxtjs/sitemap', 'nuxt-gtag'],

  css: ['~/assets/css/tokens.css', '~/assets/css/base.css', '~/assets/css/prose.css'],

  // components are named by file name alone (site/LogoMark.vue -> <LogoMark>)
  components: [{ path: '~/components', pathPrefix: false }],

  app: {
    head: {
      htmlAttrs: { lang: 'ja' },
      titleTemplate: `%s | ${SITE_NAME}`,
      meta: [
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'description', content: SITE_DESCRIPTION },
        { property: 'og:site_name', content: SITE_NAME },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: `${ORIGIN}${OGP_DEFAULT_IMAGE}` },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@yoshihiko5555' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Anybody:wdth,wght@50..150,100..900&family=Chakra+Petch:wght@400;500;600&family=JetBrains+Mono:wght@400;700&family=Silkscreen:wght@400;700&family=Zen+Kaku+Gothic+New:wght@400;500;700;900&display=swap',
        },
        // new mark (design/logo): the SVG where supported, the ICO (16/32/48) for the rest.
        // sizes="32x32" keeps Chrome from preferring the ICO over the SVG
        { rel: 'icon', href: '/favicon.ico', sizes: '32x32' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'alternate', type: 'application/rss+xml', title: SITE_NAME, href: '/feed.xml' },
      ],
    },
  },

  runtimeConfig: {
    // server only: read at build time when the site is prerendered
    ctfEndpoint: process.env.CTF_ENDPOINT || '',
    ctfCdaToken: process.env.CTF_CDA_TOKEN || '',
    public: {
      origin: ORIGIN,
      siteName: SITE_NAME,
      siteDescription: SITE_DESCRIPTION,
    },
  },

  site: {
    url: ORIGIN,
    name: SITE_NAME,
  },

  sitemap: {
    // pagination pages stay out of the sitemap, as on the old site
    exclude: ['/blog/page/**', '/categories/*/page/**', '/tags/*/page/**'],
  },

  gtag: {
    id: process.env.GTAG_ID || '',
  },

  routeRules: {
    // About and Works now live on the top page; Contact was removed
    '/about': { redirect: { to: '/#status', statusCode: 301 } },
    '/works': { redirect: { to: '/#works', statusCode: 301 } },
    '/contact': { redirect: { to: '/', statusCode: 301 } },
    // the old PWA service worker is replaced by one that removes itself
    '/sw.js': { headers: { 'cache-control': 'public, max-age=0, must-revalidate' } },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/blog', '/feed.xml', '/sitemap.xml'],
      failOnError: true,
    },
  },
})
