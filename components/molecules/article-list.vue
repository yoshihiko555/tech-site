<template>
  <div class="mb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <vs-card type='1' v-for="article in articles" :key="article.sys.id" class="mx-auto mb-8 px-4" @click="$router.push(`/blog/${article.slug}`)">
      <template #img>
        <nuxt-img
          v-if="hasImageUrl(article.thumbnail && article.thumbnail.url) && !isNuxtImageFailed(article.sys.id)"
          :src='resolveImageUrl(article.thumbnail && article.thumbnail.url)'
          :alt='resolveAlt(article)'
          loading="lazy"
          @error.native='markNuxtImageFailed(article.sys.id)'
        />
        <img
          v-else-if="hasImageUrl(article.thumbnail && article.thumbnail.url)"
          :src='resolveImageUrl(article.thumbnail && article.thumbnail.url)'
          :alt='resolveAlt(article)'
          loading="lazy"
          @error='replaceWithFallback'
        />
      </template>
      <template #interactions>
        <vs-button v-if="article.category" :to='`/categories/${article.category.slug}`' class="category" @click.stop>
          <span>{{ article.category.name }}</span>
        </vs-button>
      </template>
      <template #title>
        <p class="date" v-if="article.sys">{{ $moment(article.sys.firstPublishedAt).format('MMM Do YYYY') }}</p>
        <h3 class="title">{{ article.title }}</h3>
      </template>
      <template #text>
        <p class="lead-text">{{ article.description || $truncate(article.content && article.content.replace(/\[\[toc\]\]\s/, '') || '', 60) }}</p>
        <div v-if='article.tagsCollection && article.tagsCollection.items.length'>
          <span
            v-for='tag in article.tagsCollection.items'
            :key="tag && tag.sys.id"
            :to='tag && tag.slug'
            @click.stop='$router.push(`/tags/${tag && tag.slug}`)'
            class="tag"
          >#{{ tag && tag.name }}</span>
        </div>
      </template>
    </vs-card>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, ref } from '@nuxtjs/composition-api'
import { Articles } from '~/generated/graphql'
export default defineComponent({
  props: {
    articles: {
      type: Array as PropType<Articles[]>,
      required: true,
    }
  },
  setup () {
    const nuxtImageFailedMap = ref<Record<string, boolean>>({})

    const resolveImageUrl = (url?: string | null) => {
      if (!url) return ''
      return url.startsWith('//') ? `https:${url}` : url
    }

    const resolveAlt = (article: Articles) => {
      return article.thumbnail?.description || article.title || ''
    }

    const hasImageUrl = (url?: string | null) => {
      return Boolean(resolveImageUrl(url))
    }

    const isNuxtImageFailed = (id: string) => {
      return Boolean(nuxtImageFailedMap.value[id])
    }

    const markNuxtImageFailed = (id: string) => {
      nuxtImageFailedMap.value = {
        ...nuxtImageFailedMap.value,
        [id]: true,
      }
    }

    const replaceWithFallback = (event: Event) => {
      const target = event.target as HTMLImageElement | null
      if (!target) return
      if (target.src.endsWith('/ogp-default.jpeg')) return
      target.src = '/ogp-default.jpeg'
    }

    return {
      hasImageUrl,
      isNuxtImageFailed,
      markNuxtImageFailed,
      replaceWithFallback,
      resolveAlt,
      resolveImageUrl,
    }
  }
})
</script>

<style lang="scss" scoped>
.date {
  @apply mb-1;
}

.lead-text {
  @apply mb-3;
}

.category {
  @apply bg-opacity-50 bg-site-theme-light hover:bg-opacity-80;
}

.tag {
  @apply p-1 text-site-theme-light transition-all duration-300 ease-in-out hover:text-site-theme;
}
</style>
