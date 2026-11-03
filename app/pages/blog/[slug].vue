<script setup lang="ts">
import type { PostDetail } from '#shared/types/post'

const route = useRoute()
const slug = String(route.params.slug)
const { data: post, error } = await useFetch<PostDetail>(`/api/posts/${slug}`, { key: `post-${slug}` })
if (error.value || !post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

const headings = computed(() => post.value?.headings ?? [])
const sectionCount = computed(() => headings.value.filter(h => h.level === 2).length)
const codeCount = computed(() => (post.value?.html.match(/<figure class="code"/g) ?? []).length)
const { activeId, activeSubId } = useReadingState(() => headings.value, 'prose')

const { origin } = useRuntimeConfig().public
const image = post.value.thumbnail
  ? `https:${post.value.thumbnail.url.replace(/^https?:/, '')}`
  : `${origin}/ogp-default.jpeg`
useSeoMeta({
  title: post.value.title,
  description: post.value.description,
  ogTitle: post.value.title,
  ogDescription: post.value.description,
  ogType: 'article',
  ogUrl: `${origin}/blog/${slug}`,
  ogImage: image,
  twitterTitle: post.value.title,
  twitterDescription: post.value.description,
  twitterImage: image,
  articlePublishedTime: post.value.publishedAt,
  articleModifiedTime: post.value.updatedAt,
})
</script>

<template>
  <div v-if="post">
    <ArticleHead
      :post="post"
      :sections="sectionCount"
      :code-blocks="codeCount"
    />
    <div class="alayout">
      <ArticleToc
        variant="rail"
        :headings="headings"
        :active-id="activeId"
        :active-sub-id="activeSubId"
      />
      <div class="column">
        <ArticleToc
          variant="menu"
          :headings="headings"
        />
        <ArticleBody
          id="prose"
          :html="post.html"
        />
      </div>
    </div>
    <ArticleEnd :post="post" />
  </div>
</template>

<style scoped>
.alayout {
  max-width: 1180px;
  margin: 0 auto;
  padding-left: var(--gut-l);
  padding-right: var(--gut-r);
  padding-block: 56px 40px;
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr);
  gap: 56px;
}
.column {
  min-width: 0;
}
@media (max-width: 980px) {
  .alayout {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
  }
}
</style>
