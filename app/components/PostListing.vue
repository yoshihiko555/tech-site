<script setup lang="ts">
import type { PostMeta } from '#shared/types/post'

const props = defineProps<{
  heading: string
  posts: PostMeta[]
  page: number
  basePath: string
}>()

const pages = computed(() => countPages(props.posts.length))
const shown = computed(() => slicePage(props.posts, props.page))

if (props.page > pages.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}
</script>

<template>
  <section>
    <h1>{{ heading }}</h1>
    <p>{{ posts.length }} posts / page {{ page }} of {{ pages }}</p>
    <ol>
      <li
        v-for="post in shown"
        :key="post.slug"
      >
        <time :datetime="post.publishedAt">{{ post.publishedAt.slice(0, 10) }}</time>
        <NuxtLink :to="`/blog/${post.slug}`">
          {{ post.title }}
        </NuxtLink>
      </li>
    </ol>
    <nav
      v-if="pages > 1"
      aria-label="Pages"
    >
      <NuxtLink
        v-for="n in pages"
        :key="n"
        :to="pagePath(basePath, n)"
        :aria-current="n === page ? 'page' : undefined"
      >
        {{ n }}
      </NuxtLink>
    </nav>
  </section>
</template>
