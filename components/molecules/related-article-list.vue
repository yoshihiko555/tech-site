<template>
  <section class="related">
    <h2 class="related-title">{{ title }}</h2>
    <ul class="related-list">
      <li v-for="article in articles" :key="article.sys.id" class="related-item">
        <nuxt-link :to="`/blog/${article.slug}`" class="related-link">
          <p class="related-date">
            {{ $moment(article.sys.firstPublishedAt).format('MMM Do YYYY') }}
          </p>
          <h3 class="related-item-title">{{ article.title }}</h3>
          <p class="related-description">
            {{ article.description || $truncate(article.content && article.content.replace(/\[\[toc\]\]\s/, '') || '', 60) }}
          </p>
          <p v-if="article.category" class="related-category">
            {{ article.category.name }}
          </p>
        </nuxt-link>
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { Articles } from '~/generated/graphql'

export default defineComponent({
  props: {
    title: {
      type: String,
      default: '関連記事',
    },
    articles: {
      type: Array as PropType<Articles[]>,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.related-title {
  @apply mb-5 text-lg sm:text-xl font-bold;
}

.related-list {
  @apply space-y-4;
}

.related-item {
  @apply border border-gray-200 rounded-lg transition-colors duration-300 ease-in-out hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-400;
}

.related-link {
  @apply block p-4 sm:p-5;
}

.related-date {
  @apply mb-2 text-xs sm:text-sm text-gray-500;
}

.related-item-title {
  @apply mb-2 text-base sm:text-lg font-bold;
}

.related-description {
  @apply mb-2 text-sm leading-6 text-gray-600 dark:text-gray-300;
}

.related-category {
  @apply inline-block px-2 py-1 text-xs rounded bg-gray-100 dark:bg-site-black-theme;
}
</style>
