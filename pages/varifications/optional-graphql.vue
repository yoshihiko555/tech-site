<template>
  <div>
    <h1>optional-graphql</h1>
    {{ articles }}
  </div>
</template>

<script>
import query from '~/graphql/queries/articles.gql'
export default {
  data: () => ({
    // 初期値としてNullをセットしておく
    articles: null,
  }),
  apollo: {
    // 返却するデータを定義
    articles: {
      prefetch: true,
      query: query,
      // 取得結果から更にデータを特定したいときは、update関数を使用してデータを特定する
      update: (data) => data.articlesCollection.items
    }
  }
}
</script>
