<template>
  <div>
    <div v-if="!loading">
      <h1 class='page-title'>Blog</h1>
      <article-list :articles="articles" />
      <div class="flex items-center justify-center mb-20">
        <vs-pagination
          v-model='page'
          :length='totalPages'
          @input='pageChange'
        />
      </div>
      <categories />
      <tags />
    </div>
    <div v-else>
      <p class="page-title">Now Loading...</p>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, useContext, useRouter } from '@nuxtjs/composition-api'
import { useGetArticlesQuery } from '~/generated/graphql'
import { useResult } from '@vue/apollo-composable'

import ArticleList from '~/components/molecules/article-list.vue'
import Categories from '~/components/organisms/categories.vue'
import Tags from '~/components/organisms/tags.vue'

export default defineComponent({
  components: {
    ArticleList,
    Categories,
    Tags,
  },
  head: {
    title: 'Blog',
    meta: [],
  },
  setup () {
    const { route } = useContext()
    const router = useRouter()
    const page = ref<number>(Number(route.value.params.page) || 1)
    const limit = 8
    const skip = (page.value - 1) * limit
    const pageChange = () => router.push(`/blog/page/${page.value}`)

    const { result, loading } = useGetArticlesQuery({
      limit,
      skip
    })
    const articles = useResult(result, [], data => data?.articlesCollection?.items)
    const totalPages = useResult(result, 1, data => Math.ceil((data?.articlesCollection?.total || 1) / limit))

    return {
      page,
      pageChange,
      totalPages,
      articles,
      loading,
    }
  }
})
</script>

<style lang='scss' scoped>

</style>
