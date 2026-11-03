import { Feed } from 'feed'

/** RSS 2.0 feed with the full body of every post (same contents as the old /feed.xml). */
export default defineEventHandler(async (event) => {
  const { origin, siteName, siteDescription } = useRuntimeConfig().public
  const { records } = await loadPosts()

  const feed = new Feed({
    title: siteName,
    description: siteDescription,
    id: origin,
    link: origin,
    language: 'ja',
    favicon: `${origin}/favicon.ico`,
    image: `${origin}/apple-touch-icon.png`,
    copyright: `© ${new Date().getFullYear()} ${siteName}`,
    feedLinks: { rss: `${origin}/feed.xml` },
  })
  feed.addCategory('blog')
  feed.addContributor({ name: siteName, email: 'yoshihiko05410@gmail.com', link: origin })

  for (const post of records) {
    feed.addItem({
      id: post.slug,
      title: post.title,
      link: `${origin}/blog/${post.slug}`,
      description: post.description,
      content: renderFeedHtml(post.content, origin),
      published: new Date(post.publishedAt),
      date: new Date(post.updatedAt),
      image: post.thumbnail ? `https:${post.thumbnail.url.replace(/^https?:/, '')}` : undefined,
      category: post.category ? [{ name: post.category.name }] : undefined,
    })
  }

  setHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')
  return feed.rss2()
})
