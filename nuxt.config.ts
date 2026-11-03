// https://nuxt.com/docs/api/configuration/nuxt-config
const SITE_NAME = 'Yoshihiko'
const SITE_DESCRIPTION = 'Yoshihiko tech siteです。技術ブログ兼ポートフォリオにもなっています。'
const ORIGIN = process.env.ORIGIN || 'https://yoshihiko.tech'

export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: true },

  modules: ['@nuxt/eslint', '@nuxtjs/sitemap', 'nuxt-gtag'],

  app: {
    head: {
      htmlAttrs: { lang: 'ja' },
      titleTemplate: `%s | ${SITE_NAME}`,
      meta: [
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'description', content: SITE_DESCRIPTION },
        { property: 'og:site_name', content: SITE_NAME },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: `${ORIGIN}/ogp-default.jpeg` },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@yoshihiko5555' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
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
