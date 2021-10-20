<template>
  <div class="mb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    <vs-card type='1' v-for="article in articles" :key="article.sys.id" class="mx-auto mb-8 px-4" @click="$router.push(`/blog/${article.slug}`)">
      <template #img>
        <nuxt-img v-if="article.thumbnail" :src='article.thumbnail.url' />
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
        <p class="lead-text">{{ $truncate(article.content && article.content.replace(/\[\[toc\]\]\s/, '') || '', 60) }}</p>
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
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { Articles } from '~/generated/graphql'
export default defineComponent({
  props: {
    articles: {
      type: Array as PropType<Articles[]>,
      required: true,
    }
  },
  setup () {

    return {

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
