<template>
  <div>
    <h1 class="mb-5">composition-graphql</h1>

    <h2>AllArticles</h2>
    <div v-show="loading">Loading...</div>
    <div v-if="allArticles && allArticles.length">
      <div class="mb-5" v-for="(article, i) in allArticles" :key="i">
        <div v-if="article !== null">
          <small>{{ article.sys.id }}</small>
          <p>{{ article.title }}</p>
          <div v-html="$md.render(article.content)"></div>
        </div>
      </div>
    </div>

    <h2>OnceArticle</h2>
    <!-- <div v-if="onceArticle && onceArticle.length">
      <div class="mb-5" v-for="article in onceArticle" :key="article.sys.id">
        <small>{{ article.sys.id }}</small>
        <p>{{ article.title }}</p>
        <div v-html="$md.render(article.content)"></div>
      </div>
    </div> -->
    <!-- なぜか下記のようにsys.idを取得した際にSSRであれば、問題なく動くが
    nuxt-linkからの遷移時はエラーになってしまう。
    ※onceArticle.sysまでは取得が出来る -->
    <!-- <small>{{ onceArticle.sys.id }}</small>
    <p>{{ onceArticle.title }}</p> -->
  </div>
</template>

<script lang='ts'>
import { defineComponent } from '@nuxtjs/composition-api'
import { useQuery, useResult } from '@vue/apollo-composable'
import { GetArticlesDocument, AppInitDocument } from '~/generated/graphql'
export default defineComponent({
  setup () {
    // 記事情報をすべて取得する
    const { result: res1, loading } = useQuery(GetArticlesDocument)
    const allArticles = useResult(res1, [], data => data?.articlesCollection?.items)
    // 記事情報を１件取得する
    const { result: res2 } = useQuery(AppInitDocument, { limit: 1 })
    const onceArticle = useResult(res2, [], (data) => data?.articlesCollection?.items[0])

    return {
      allArticles,
      onceArticle,
      loading,
    }
  }
})
</script>
