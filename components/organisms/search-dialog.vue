<template>
  <vs-dialog
    ref="root"
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
    >
      <template #icon>
        <i class="bx bx-search" />
      </template>
    </vs-input>
    <div v-show="variables.value">
      <div v-if="articles && articles.length" class="my-4">
        <nuxt-link
          class="card"
          v-for="article in articles"
          :key="article && article.sys.id"
          :to="`/blog/${article.slug}`"
          @click.native="$emit('update:open', false)"
        >
          <h3 class="mb-8 text-lg">{{ article.title }}</h3>
          <div class="flex justify-between">
            <p class="px-2 py-1 bg-gray-100 rounded">{{ article.category.name }}</p>
            <p>{{ $moment(article.sys.publishedAt).format('MMM Do YYYY') }}</p>
          </div>
        </nuxt-link>
      </div>
    </div>
  </vs-dialog>
</template>

<script lang='ts'>
import { defineComponent, reactive, onMounted } from '@nuxtjs/composition-api'
import { useResult } from '@vue/apollo-composable'
import { useSearchArticlesQuery, SearchArticlesQueryVariables } from '~/generated/graphql'
export default defineComponent({
  props: {
    open: {
      type: Boolean,
    }
  },
  setup (_, { refs }) {

    onMounted(() => {
      const parent = refs.input as Vue
      const input = parent.$el.children[0].children[0] as HTMLInputElement
      input.focus()
    })

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

.card {
  @apply block my-8 px-2 py-3 rounded-xl shadow transition-colors hover:bg-gray-50;
}
</style>
