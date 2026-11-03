<script setup lang="ts">
import type { PostDetail } from '#shared/types/post'

const route = useRoute()
const slug = String(route.params.slug)
const { data: post, error } = await useFetch<PostDetail>(`/api/posts/${slug}`, { key: `post-${slug}` })
if (error.value || !post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

const { origin } = useRuntimeConfig().public
const image = post.value.thumbnail ? `https:${post.value.thumbnail.url.replace(/^https?:/, '')}` : `${origin}/ogp-default.jpeg`
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
  <article v-if="post">
    <header>
      <p>
        <NuxtLink to="/blog">
          writing
        </NuxtLink>
        <template v-if="post.category">
          /
          <NuxtLink :to="`/categories/${post.category.slug}`">
            {{ post.category.name }}
          </NuxtLink>
        </template>
      </p>
      <h1>{{ post.title }}</h1>
      <p>{{ post.description }}</p>
      <p>
        <time :datetime="post.publishedAt">{{ post.publishedAt.slice(0, 10) }}</time>
        / {{ post.readingMinutes }} min read
      </p>
      <ul>
        <li
          v-for="tag in post.tags"
          :key="tag.slug"
        >
          <NuxtLink :to="`/tags/${tag.slug}`">
            #{{ tag.name }}
          </NuxtLink>
        </li>
      </ul>
    </header>
    <nav aria-label="Contents">
      <ol>
        <li
          v-for="heading in post.headings"
          :key="heading.id"
          :data-level="heading.level"
        >
          <a :href="`#${heading.id}`">{{ heading.text }}</a>
        </li>
      </ol>
    </nav>
    <!-- eslint-disable-next-line vue/no-v-html -- body is rendered from our own Contentful posts at build time -->
    <div v-html="post.html" />
    <footer>
      <NuxtLink
        v-if="post.older"
        :to="`/blog/${post.older.slug}`"
      >
        Older: {{ post.older.title }}
      </NuxtLink>
      <NuxtLink
        v-if="post.newer"
        :to="`/blog/${post.newer.slug}`"
      >
        Newer: {{ post.newer.title }}
      </NuxtLink>
      <ul>
        <li
          v-for="item in post.related"
          :key="item.slug"
        >
          <NuxtLink :to="`/blog/${item.slug}`">
            {{ item.title }}
          </NuxtLink>
        </li>
      </ul>
    </footer>
  </article>
</template>
