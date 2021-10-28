<template>
  <div>
    <div v-if="tag && !loading">
      <h1 class="page-title">{{ tag.name }}</h1>
      <div v-if="articles && articles.length">
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
        <p class="mb-20 text-center text-xl">記事がありません</p>
        <categories />
        <tags />
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, useContext, useMeta, useRouter, ref } from '@nuxtjs/composition-api'
import { useResult } from '@vue/apollo-composable'
import { useGetArticleByTagQuery } from '~/generated/graphql'
import ArticleList from '~/components/molecules/article-list.vue'
import Categories from '~/components/organisms/categories.vue'
import Tags from '~/components/organisms/tags.vue'
export default defineComponent({
  components: {
    ArticleList,
    Categories,
    Tags,
  },
  head: {},
  setup () {
    const { route, $config, error } = useContext()
    const router = useRouter()

    // ページネーション
    const page = ref<number>(Number(route.value.params.page) || 1)
    const limit = 8
    const skip = (page.value - 1) * limit
    const pageChange = () => router.push(`/tags/page/${page.value}`)

    const { result, onResult, loading } = useGetArticleByTagQuery({
      slug: route.value.params.slug,
      limit,
      skip,
    })

    const tag = useResult(result, null, data => data?.tagsCollection?.items[0])
    const articles = useResult(result, [], data => data?.tagsCollection?.items[0]?.linkedFrom?.articlesCollection?.items)
    const totalPages = useResult(result, 1, data => Math.ceil((data?.tagsCollection?.items[0]?.linkedFrom?.articlesCollection?.total || 1)/limit))

    onResult(res => {
      if (!res.data.tagsCollection?.items.length)
        error({ statusCode: 404 })
      else
        setHead()
    })

    // **********************
    // Headタグ設定
    // **********************
    const { title, meta } = useMeta()
    const setHead = () => {
      const _title = tag.value?.name || 'Tag'
      const _content = `${_title}の記事一覧です。`
      title.value = _title
      meta.value = [
        { hid: 'description', name: 'description', content: _content },
        { hid: 'og:type', name: 'og:type', content: 'website' },
        { hid: 'og:title', property: 'og:title', content: `${_title} | Yoshihiko` },
        { hid: 'og:description', property: 'og:description', content: _content },
        { hid: 'og:url', property: 'og:url', content: `${$config.origin}${route.value.path}` },
        { hid: 'twitter:title', property: 'twitter:title', content: `${_title} | Yoshihiko` },
        { hid: 'twitter:description', property: 'twitter:description', content: _content },
      ]
    }

    return {
      tag,
      articles,
      loading,
      page,
      totalPages,
      pageChange,
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
