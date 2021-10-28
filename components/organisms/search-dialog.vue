<template>
  <vs-dialog
    ref="root"
    class="overflow-hidden"
    :value="open"
    @input="$emit('update:open', false)"
  >
    <template #header>
      <h3 class="text-2xl">Search</h3>
    </template>
    <vs-input
      v-model="variables.value"
      :loading="loading"
      ref="input"
      placeholder="Search articles..."
      @keyup.esc="$emit('update:open', false)"
    >
      <template #icon>
        <i class="bx bx-search" />
      </template>
    </vs-input>
    <div v-show="variables.value">
      <div v-if="articles && articles.length" class="result-wrapper">
        <nuxt-link
          class="article-card"
          v-for="article in articles"
          :key="article && article.sys.id"
          :to="`/blog/${article && article.slug}`"
          @click.native="$emit('update:open', false)"
        >
          <h3 class="mb-8 text-lg">{{ article && article.title }}</h3>
          <div class="flex justify-between">
            <p class="px-2 py-1 rounded bg-gray-100 dark:bg-site-black-back">{{ article && article.category && article.category.name }}</p>
            <p>{{ $moment(article && article.sys.publishedAt).format('MMM Do YYYY') }}</p>
          </div>
        </nuxt-link>
      </div>
    </div>
  </vs-dialog>
</template>

<script lang='ts'>
import { defineComponent, reactive, onMounted, watch, toRefs } from '@nuxtjs/composition-api'
import { useResult } from '@vue/apollo-composable'
import { useSearchArticlesQuery, SearchArticlesQueryVariables } from '~/generated/graphql'
export default defineComponent({
  props: {
    open: {
      type: Boolean,
    }
  },
  setup (props, { refs }) {
    onMounted(() => {
      const parent = refs.input as Vue
      const input = parent.$el.children[0].children[0] as HTMLInputElement
      input.focus()
    })

    // TODO : v-ifで都度マウントしているため、Vuesaxのデザインが効いていない
    // const { open } = toRefs(props)
    // watch(open, now => {
    //   console.log('now:', now, refs)
    //   if (now) {
    //     const parent = refs.input as Vue
    //     const input = parent.$el.children[0].children[0] as HTMLInputElement
    //     input.focus()
    //   }
    // })

    // 検索ロジック
    const variables = reactive<SearchArticlesQueryVariables>({
      value: ''
    })
    const { result, loading } = useSearchArticlesQuery(variables)
    const articles = useResult(result, null, data => data?.articlesCollection?.items)

    return {
      loading,
      articles,
      variables,
    }
  },
})
</script>

<style lang="scss" scoped>
.vs-input-parent::v-deep .vs-input-content {
  @apply w-full;

  .vs-input {
    @apply w-full;
  }
}

.result-wrapper {
  $outer-padding: 160px;
  $innter-padding: 92px;
  @apply my-4 overflow-y-auto;
  max-height: calc(80vh - #{$outer-padding + $innter-padding});

  .article-card {
    @apply block mx-2 my-8 px-4 py-5 rounded-xl shadow transition-colors bg-white dark:bg-site-black hover:bg-gray-50 dark:hover:bg-site-black-theme;
  }
}

::-webkit-scrollbar {
  @apply w-2 h-2;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-50 rounded-md;
}
</style>
