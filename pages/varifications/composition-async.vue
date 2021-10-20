<template>
  <div>
    <h1>Composition Async Data</h1>
    <div v-if="state.article">
      <p>{{ $truncate(state.article.value.content, 10) }}</p>
      {{ $moment() }}
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, useAsync, ref, toRefs, reactive, useMeta, watch, useContext,  } from '@nuxtjs/composition-api'
import { useResult } from '@vue/apollo-composable'
import { useGetArticleByIdQuery } from '~/generated/graphql'
export default defineComponent({
  head: {},
  setup () {
    console.log('created')
    const { $moment } = useContext()
    const { title } = useMeta()
    // const article = reactive({})
    const state = toRefs(reactive({
      article: null as any,
      hoge: null as any
    }))
    useAsync (async () => {
      console.log('async methods')
      const { result } = useGetArticleByIdQuery({ id: '5MkjQBQFy7XW9FqE7cCRGw' })
      console.log('result:', result)
      state.article.value = useResult(result, null, data => {
        console.log('data:', data)
        return data?.articles
      })
      console.log('async article:', state.article.value)
      state.hoge = useResult(result, null, data => data?.articles)
      console.log('async hoge:', state.hoge.value)
      // title.value = state.hoge.value.
    })
    console.log('after create article', state.article.value)
    console.log('after create hoge', state.hoge.value)

    watch(state.article, () => {
      console.log('articleが変わった')
      title.value = state.article.value.title
    })
    return {
      state
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
