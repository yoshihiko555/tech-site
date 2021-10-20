<template>
  <div>
    <div class="mb-10 grid grid-cols-1 lg:grid-cols-6" v-if="article">
      <div class="article col-span-2 lg:col-span-4">
        <h2
          v-if="article.category"
          @click="$router.push(`/categories/${article && article.category && article.category.slug}`)"
          class="inline-block cursor-pointer my-4 sm:my-5 px-2 py-1 sm:px-3 sm:py-2 text-sm sm:text-base font-thin bg-gray-100 rounded transition-colors duration-500 ease-in-out hover:text-gray-400"
        >
          {{ article.category.name }}
        </h2>

        <h1 class="mb-3 text-xl sm:text-3xl text-center">{{ article.title }}</h1>

        <div
          v-if="tags"
          class="mb-6 text-center"
        >
          <tag
            v-for="tag in tags"
            :key="tag && tag.sys.id"
            :tag="tag"
            small
          />
        </div>

        <div class="mb-4 flex items-center justify-end text-xs sm:text-sm font-light text-gray-400">
          <i class='bx bx-time-five px-1' />
          <span class="align-middle px-1 mr-1">
            {{ $moment(article.sys.firstPublishedAt).format('MMM Do YYYY') }}
          </span>
          <i
            v-show="article.sys.firstPublishedAt !== article.sys.publishedAt"
            class='bx bx-revision px-1'
          />
          <span
            v-show="article.sys.firstPublishedAt !== article.sys.publishedAt"
            class=" align-middle px-1"
          >
            {{ $moment(article.sys.publishedAt).format('MMM Do YYYY') }}
          </span>
        </div>

        <nuxt-img class="mb-10" v-if="article.thumbnail" :src='article.thumbnail.url' :alt='article.thumbnail.description' />
        <div class="markdown-body line-numbers" v-html="parse(article.content)" v-interpolation/>
      </div>
      <aside
        v-html="toc(article.content)"
        class="toc"
      />
    </div>
  </div>
</template>

<script lang='ts'>
/**
 * TODO
 * - 目次 : OKだけどだいぶ無理やりやった感がある。。。
 *   - 参考記事
 *     https://nishimura.club/nuxt-jest
 *     https://github.com/RyuNIshimura/next-blog/blob/b9368ae08cdf0029b24bb210676dc9aab689c064/lib/markdown-utils.ts#L42
 *   →一度のパースで内容と目次を生成するよう修正すべきである
 * - 404ページへの遷移 : OK
 * - 戻るボタンでページ内で遷移する（今だとURLは戻っているけど画面上は戻っていない）
 * - 自サイトのリンクと、外部サイトのリンクで処理を切り替え
 *     - https://izm51.com/posts/markdown-it-target-blank-anchor/
 * - やはり、ApolloClientがCSRだとスクリプト上ではNullとかUndefinedになってしまう問題はなんとかしなくてはいけない
 * - CSRとSSRでのレンダリングに差異が生まれて、エラーが発生してしまう（厳密にはVue.warn）
 * - コメント機能
 */
import { defineComponent, useContext, ref, watch, useMeta } from '@nuxtjs/composition-api'
import { useResult } from '@vue/apollo-composable'
import { useGetArticleBySlugQuery } from '~/generated/graphql'
import { Maybe } from 'graphql/jsutils/Maybe'
import Prism from '~/plugins/prism'

import Tag from '~/components/atoms/tag.vue'
export default defineComponent({
  components: {
    Tag,
  },
  head: {},
  setup () {
    const { route, $md, $truncate, $log, $config, error } = useContext()

    // 記事情報取得
    const { result, onResult } = useGetArticleBySlugQuery({ slug: route.value.params.slug })
    const article = useResult(result, null, data => data?.articlesCollection?.items[0])
    const tags = useResult(result, [], data => data?.articlesCollection?.items[0]?.tagsCollection?.items)

    onResult(res => {
      if (!res.data.articlesCollection?.items.length)
        error({ statusCode: 404 })
      else
        setHead()
    })

    // **********************
    // Headタグ設定
    // **********************
    const { title, meta } = useMeta()

    /** Headタグ設定処理 */
    const setHead = () => {
      const _title = article.value?.title || 'Article'
      const _content = $truncate(article.value?.content?.replace(/\[\[toc\]\]\s/, '') || '', 60) || ''
      const _thumbnail = article.value?.thumbnail?.url || `${$config.origin}/ogp-default.jpeg`
      title.value = _title
      meta.value = [
        { hid: 'description', name: 'description', content: _content },
        { hid: 'og:type', name: 'og:type', content: 'article' },
        { hid: 'og:title', property: 'og:title', content: `${_title} | Yoshihiko` },
        { hid: 'og:description', property: 'og:description', content: _content },
        { hid: 'og:url', property: 'og:url', content: `${$config.origin}${route.value.path}` },
        { hid: 'og:image', property: 'og:image', content: _thumbnail },
        { hid: 'twitter:title', property: 'twitter:title', content: `${_title} | Yoshihiko` },
        { hid: 'twitter:description', property: 'twitter:description', content: _content },
        { hid: 'twitter:image', property: 'twitter:image', content: _thumbnail },
      ]
    }

    // ********************
    // Markdown解析処理
    // ********************
    /** ハイライト処理実行済みか否か */
    const isExecuteHighlight = ref(false)
    watch(isExecuteHighlight, () => {
      Prism.highlightAll()
    })

    /** 目次項目抽出用の正規表現 */
    const regx = new RegExp(/^<p><div class="table-of-contents">.*<\/div><\/p>/)

    /**
     * 本文用解析処理
     */
    const parse = (value: Maybe<string>) => {
      if (!value) return ''
      const str: string = $md.render(value)
      const res = str.replace(regx, '')
      // Markdownの解析が完了したのでハイライト処理を実行させる
      isExecuteHighlight.value = true
      return res
    }

    /**
     * 目次抽出用解析処理
     */
    const toc = (value: Maybe<string>) => {
      if (!value) return ''
      const str: string = $md.render(value)
      const res = str.match(regx)
      if (!res) return ''
      return res[0]
    }

    return {
      article,
      tags,
      parse,
      toc,
    }
  }
})
</script>

<style lang='scss' scoped>
.toc::v-deep {
  @apply sticky top-10 ml-20 h-screen hidden col-span-2 lg:block;
  li > ul { padding-left: 1rem; }
  a {
    @apply block mb-1 px-3 py-2 text-sm font-bold rounded-md transition-colors duration-300 ease-in-out hover:bg-gray-200;
  }
}
.article::v-deep {

  .markdown-body {
    // 文字
    h1, h2, h3, h4, h5, h6 {
      @apply my-8;
    }

    p {
      @apply mb-3 sm:mb-4 text-sm sm:text-base tracking-wider;
    }

    h1 {
      @apply relative mt-10 sm:mt-14 pb-2 border-b text-xl sm:text-2xl border-site-theme-light;

      &::after {
        @apply absolute left-0 z-10 w-1/5 h-1 bg-gray-700;
        content: '';
        bottom: -2px;
      }
    }

    h2 {
      @apply mt-8 sm:mt-12 pb-1 text-lg sm:text-xl border-b border-gray-300;
    }

    h3 {
      @apply mt-6 sm:mt-10 pl-3 text-base sm:text-lg border-l-4 border-gray-300;
    }

    a {
      @apply text-blue-500 transition-colors hover:text-blue-300 hover:underline;
    }

    // 画像
    img {
      @apply mb-8;
    }

    // リスト
    %list-root {
      @apply mb-4 pl-4 sm:pl-8;
      li {
        @apply mb-1 text-xs sm:text-base;
      }
    }

    > ol {
      @extend %list-root;
      li { list-style: decimal; }
    }

    > ul {
      @extend %list-root;
      li {
        list-style: disc;

        > ul {
          @apply pl-6;
          li { list-style: circle; }
        }
      }
    }

    // コード
    .code-toolbar {
      pre {
        @apply mb-8 pt-10 bg-gray-700 overflow-x-auto rounded-md;

        code {
          @apply text-gray-100;
        }
      }
      .toolbar {
        @apply flex flex-row-reverse justify-between top-2 right-0 w-full px-4 opacity-100;
        .toolbar-item {
          @apply text-lg font-medium;

          // クリップボード
          &:first-child {
            button {
              @apply px-2 py-1 text-gray-50 bg-site-theme transition-all duration-300 ease-in-out hover:text-opacity-80;
            }
          }

          // 言語
          &:last-child {
            span {
              @apply text-gray-50 bg-transparent shadow-none;
            }
          }
        }
      }
    }

    blockquote {
      @apply p-4 bg-gray-100 border-l-4 border-gray-500 rounded;
      p { @apply m-0; }
    }

    details {
      @apply mb-4;
      summary {
        @apply mb-4 cursor-pointer;
      }
    }

    table {
      @apply mb-4 ml-4 border-collapse;

      thead {
        @apply border-gray-100;
        font-size: 1.1em;
        border-bottom: .5px solid;
      }
      tbody {
        tr:nth-child(odd) {
          @apply bg-gray-100;
        }
      }
      th, td {
        padding: .5em;
        border: .5px solid #e0e0e0;
      }
    }
  }
}
</style>
