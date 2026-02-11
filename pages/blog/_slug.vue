<template>
  <div>
    <div v-if="article && !loading" class="mb-10 grid grid-cols-1 lg:grid-cols-6">
      <div class="article py-4 col-span-2 lg:col-span-4">
        <h2
          v-if="article.category"
          @click="$router.push(`/categories/${article && article.category && article.category.slug}`)"
          class="inline-block cursor-pointer mb-4 sm:mb-5 px-2 py-1 sm:px-3 sm:py-2 text-sm sm:text-base font-thin hover:text-gray-400 bg-gray-100 dark:bg-site-black-theme border border-gray-100 rounded transition-colors duration-500 ease-in-out"
        >
          {{ article.category.name }}
        </h2>

        <h1 class="mb-4 text-xl sm:text-3xl text-center">{{ article.title }}</h1>

        <div v-if="tags" class="mb-6 text-center">
          <tag v-for="tag in tags" :key="tag && tag.sys.id" :tag="tag" small />
        </div>

        <div class="mb-4 flex items-center justify-end text-xs sm:text-sm font-light text-gray-400">
          <!-- 投稿日 -->
          <i class="bx bx-time-five px-1" />
          <span class="align-middle px-1 mr-1">
            {{ $moment(article.sys.firstPublishedAt).format('MMM Do YYYY') }}
          </span>
          <!-- 更新日 -->
          <i v-show="article.sys.firstPublishedAt !== article.sys.publishedAt" class="bx bx-revision px-1" />
          <span v-show="article.sys.firstPublishedAt !== article.sys.publishedAt" class="align-middle px-1">
            {{ $moment(article.sys.publishedAt).format('MMM Do YYYY') }}
          </span>
        </div>

        <!-- サムネイル -->
        <nuxt-img
          class="mb-10"
          v-if="hasImageUrl(article.thumbnail && article.thumbnail.url) && !isNuxtThumbnailFailed"
          format="webp"
          :src="resolveImageUrl(article.thumbnail.url)"
          :alt="resolveAlt(article)"
          loading="lazy"
          @error.native="markNuxtThumbnailFailed"
        />
        <img
          class="mb-10"
          v-else-if="hasImageUrl(article.thumbnail && article.thumbnail.url)"
          :src="resolveImageUrl(article.thumbnail.url)"
          :alt="resolveAlt(article)"
          loading="lazy"
          @error="replaceWithFallback"
        />
        <!-- 記事内容 -->
        <div class="markdown-body line-numbers" v-html="parse(article.content)" v-interpolation />
        <related-article-list v-if="relatedArticles.length" :articles="relatedArticles" class="mt-14" />
      </div>
      <!-- 目次 -->
      <aside v-html="toc(article.content)" class="toc" />
    </div>
    <div v-else>
      <h1 class="my-10 text-center text-2xl font-black">Now Loading...</h1>
    </div>
  </div>
</template>

<script lang="ts">
/**
 * TODO
 * - 目次 : OKだけどだいぶ無理やりやった感がある。。。
 *   - 参考記事
 *     https://nishimura.club/nuxt-jest
 *     https://github.com/RyuNIshimura/next-blog/blob/b9368ae08cdf0029b24bb210676dc9aab689c064/lib/markdown-utils.ts#L42
 *   →一度のパースで内容と目次を生成するよう修正すべきである
 * - 戻るボタンでページ内で遷移する（今だとURLは戻っているけど画面上は戻っていない）
 * - 自サイトのリンクと、外部サイトのリンクで処理を切り替え
 *     - https://izm51.com/posts/markdown-it-target-blank-anchor/
 * - やはり、ApolloClientがCSRだとスクリプト上ではNullとかUndefinedになってしまう問題はなんとかしなくてはいけない
 * - CSRとSSRでのレンダリングに差異が生まれて、エラーが発生してしまう（厳密にはVue.warn）
 * - コメント機能
 */
import { defineComponent, useContext, ref, watch, useMeta, onMounted, useRouter, nextTick, computed } from '@nuxtjs/composition-api'
import { useResult, useQuery } from '@vue/apollo-composable'
import { Maybe } from 'graphql/jsutils/Maybe'
import graphqlTag from 'graphql-tag'
import { useGetArticleBySlugQuery, useGetArticlesQuery, Articles } from '~/generated/graphql'
import { shiftFunc } from '~/utils'
import Prism from '~/plugins/prism'

import Tag from '~/components/atoms/tag.vue'
import RelatedArticleList from '~/components/molecules/related-article-list.vue'

const RELATED_LIMIT = 3
const RELATED_CANDIDATE_LIMIT = 12
const NO_MATCH_TAG = '__no_related_tag__'
const NO_MATCH_CATEGORY = '__no_related_category__'

const GET_RELATED_ARTICLES = graphqlTag`
  query getRelatedArticles(
    $currentSlug: String!
    $tagSlugs: [String!] = []
    $categorySlug: String = ""
    $limit: Int = 12
  ) {
    articlesCollection(
      order: sys_firstPublishedAt_DESC
      limit: $limit
      where: {
        slug_not: $currentSlug
        OR: [{ tags: { slug_in: $tagSlugs } }, { category: { slug: $categorySlug } }]
      }
    ) {
      items {
        sys {
          id
          firstPublishedAt
          publishedAt
        }
        title
        content
        description
        slug
        thumbnail {
          url
          description
        }
        category {
          sys {
            id
          }
          name
          slug
        }
        tagsCollection {
          items {
            sys {
              id
            }
            name
            slug
          }
        }
      }
    }
  }
`

type RelatedArticlesQuery = {
  articlesCollection?: {
    items: Array<Articles | null>
  } | null
}

type RelatedArticlesQueryVariables = {
  currentSlug: string
  tagSlugs: string[]
  categorySlug: string
  limit: number
}

const normalizeArticles = (items: Array<Articles | null | undefined>): Articles[] => {
  return items.filter((item): item is Articles => Boolean(item && item.slug))
}

const toPublishedTime = (target: Articles): number => {
  const value = target.sys.firstPublishedAt || target.sys.publishedAt
  if (!value) return 0
  return new Date(value).getTime() || 0
}

const extractTagSlugs = (target: Articles): string[] => {
  return (target.tagsCollection?.items || [])
    .map((tag) => tag?.slug || '')
    .filter((slug): slug is string => Boolean(slug))
}

const resolveImageUrl = (url?: string | null): string => {
  if (!url) return ''
  return url.startsWith('//') ? `https:${url}` : url
}

const hasImageUrl = (url?: string | null): boolean => {
  return Boolean(resolveImageUrl(url))
}

const resolveAlt = (target: Articles): string => {
  return target.thumbnail?.description || target.title || ''
}

const replaceWithFallback = (event: Event): void => {
  const target = event.target as HTMLImageElement | null
  if (!target) return
  if (target.src.endsWith('/ogp-default.jpeg')) return
  target.src = '/ogp-default.jpeg'
}

export default defineComponent({
  components: {
    Tag,
    RelatedArticleList,
  },
  setup() {
    const { route, $md, $truncate, $config, error } = useContext()
    const isNuxtThumbnailFailed = ref(false)

    const markNuxtThumbnailFailed = () => {
      isNuxtThumbnailFailed.value = true
    }

    // 記事情報取得
    const { result, onResult, loading } = useGetArticleBySlugQuery({ slug: route.value.params.slug })
    const article = useResult(result, null, (data) => data?.articlesCollection?.items[0])
    const tags = useResult(result, [], (data) => data?.articlesCollection?.items[0]?.tagsCollection?.items)

    watch(
      () => article.value?.sys.id,
      () => {
        isNuxtThumbnailFailed.value = false
      }
    )

    const currentTagSlugs = computed(() => {
      if (!article.value) return []
      return extractTagSlugs(article.value)
    })

    const relatedQueryVariables = computed<RelatedArticlesQueryVariables>(() => {
      return {
        currentSlug: article.value?.slug || route.value.params.slug || '',
        tagSlugs: currentTagSlugs.value.length ? currentTagSlugs.value : [NO_MATCH_TAG],
        categorySlug: article.value?.category?.slug || NO_MATCH_CATEGORY,
        limit: RELATED_CANDIDATE_LIMIT,
      }
    })

    const { result: relatedResult } = useQuery<RelatedArticlesQuery, RelatedArticlesQueryVariables>(
      GET_RELATED_ARTICLES,
      relatedQueryVariables,
    )
    const relatedCandidates = useResult(relatedResult, [], (data) => data?.articlesCollection?.items || [])

    const { result: latestResult } = useGetArticlesQuery({ limit: RELATED_CANDIDATE_LIMIT, skip: 0 })
    const latestCandidates = useResult(latestResult, [], (data) => data?.articlesCollection?.items || [])

    const relatedArticles = computed<Articles[]>(() => {
      if (!article.value?.slug) return []

      const currentSlug = article.value.slug
      const currentCategorySlug = article.value.category?.slug || ''
      const currentTagSet = new Set(currentTagSlugs.value)

      const scored = normalizeArticles(relatedCandidates.value as Array<Articles | null | undefined>)
        .filter((candidate) => candidate.slug !== currentSlug)
        .map((candidate) => {
          const tagMatchCount = extractTagSlugs(candidate).reduce((count, slug) => {
            return currentTagSet.has(slug) ? count + 1 : count
          }, 0)
          const categoryMatch = Boolean(currentCategorySlug && candidate.category?.slug === currentCategorySlug)
          return {
            candidate,
            tagMatchCount,
            categoryMatch,
          }
        })
        .sort((a, b) => {
          if (a.tagMatchCount !== b.tagMatchCount) return b.tagMatchCount - a.tagMatchCount
          if (a.categoryMatch !== b.categoryMatch) return Number(b.categoryMatch) - Number(a.categoryMatch)
          return toPublishedTime(b.candidate) - toPublishedTime(a.candidate)
        })

      const selected: Articles[] = []
      const seen = new Set<string>()

      const pushIfNeeded = (candidate: Articles) => {
        if (!candidate.slug) return
        if (candidate.slug === currentSlug) return
        if (selected.length >= RELATED_LIMIT) return
        if (seen.has(candidate.sys.id)) return
        selected.push(candidate)
        seen.add(candidate.sys.id)
      }

      scored.forEach((entry) => {
        pushIfNeeded(entry.candidate)
      })

      if (selected.length < RELATED_LIMIT) {
        normalizeArticles(latestCandidates.value as Array<Articles | null | undefined>)
          .sort((a, b) => toPublishedTime(b) - toPublishedTime(a))
          .forEach((candidate) => {
            pushIfNeeded(candidate)
          })
      }

      return selected
    })

    onResult((res) => {
      if (!res.data.articlesCollection?.items.length) error({ statusCode: 404 })
      else setHead()
    })

    // **********************
    // Headタグ設定
    // **********************
    const { title, meta } = useMeta()

    /** Headタグ設定処理 */
    const setHead = () => {
      const _title = article.value?.title || 'Article'
      const _description = article.value?.description?.trim()
      const _fallback = $truncate(article.value?.content?.replace(/\[\[toc\]\]\s/, '') || '', 60) || ''
      const _content = _description || _fallback
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
    watch(isExecuteHighlight, async () => {
      // DOM更新を待ってからハイライト・Mermaid処理を実行
      await nextTick()

      Prism.highlightAll()

      // Mermaid図をレンダリング
      if (process.client) {
        const { renderMermaidDiagrams } = await import('~/plugins/mermaid')
        await renderMermaidDiagrams()
      }
    })

    /** 目次項目抽出用の正規表現 */
    const regx = /^<p><div class="table-of-contents">.*<\/div><\/p>/

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

    const router = useRouter()
    onMounted(async () => {
      await shiftFunc()
      // https://koredana.info/blog/nuxtjs-router-push-alt-anchor
      const tocs = document.querySelectorAll('.toc a[href^="#"]')
      for (let i = 0; i < tocs.length; i++) {
        tocs[i].addEventListener('click', (e) => {
          e.preventDefault()
          const target = e.target as HTMLAnchorElement
          router.push({ path: target.hash })
        })
      }
    })

    return {
      loading,
      article,
      tags,
      relatedArticles,
      hasImageUrl,
      isNuxtThumbnailFailed,
      markNuxtThumbnailFailed,
      replaceWithFallback,
      resolveAlt,
      resolveImageUrl,
      parse,
      toc,
    }
  },
  head: {},
})
</script>

<style lang="scss" scoped>
.toc::v-deep {
  @apply sticky top-24 ml-20 h-screen hidden col-span-2 lg:block;
  li > ul {
    padding-left: 1rem;
  }
  a {
    @apply block mb-1 px-3 py-2 text-sm font-bold rounded-md transition-colors duration-300 ease-in-out hover:bg-gray-200 dark:hover:text-site-black-back;
    font-family: 'Noto Sans JP', sans-serif;
  }
}

.article::v-deep {
  font-family: 'Noto Sans JP', sans-serif;

  .markdown-body {
    h1,
    h2,
    h3 {
      @apply my-10 sm:my-14;
    }

    h1 {
      @apply relative pb-2 border-b text-xl sm:text-2xl border-site-theme-light;

      &::after {
        @apply absolute left-0 z-10 w-1/5 h-1 bg-gray-700;
        content: '';
        bottom: -2px;
      }
    }

    h2 {
      @apply pb-1 text-lg sm:text-xl border-b border-gray-300;
    }

    h3 {
      @apply pl-3 text-base sm:text-lg border-l-4 border-gray-300;
    }

    h4 {
      @apply my-6 sm:my-8 pl-2 text-sm sm:text-base font-semibold border-l-2 border-gray-400;
    }

    p {
      @apply my-4 sm:my-8 text-sm sm:text-base tracking-wide leading-6 sm:leading-8;
    }

    a {
      @apply text-blue-500 transition-colors hover:text-blue-300 hover:underline;
    }

    :not(pre) > code {
      @apply px-2 text-sm sm:text-base text-gray-50 bg-gray-700 rounded;
    }

    // 画像
    img {
      @apply mx-auto my-8;
    }

    // リスト
    %list-root {
      @apply mb-4 pl-4 sm:pl-8;
      li {
        @apply mb-1 text-xs sm:text-base leading-6 sm:leading-8;
      }
    }

    > ol {
      @extend %list-root;
      li {
        list-style: decimal;
      }
    }

    > ul {
      @extend %list-root;
      li {
        list-style: disc;

        > ul {
          @apply pl-6;
          li {
            list-style: circle;
          }
        }
      }
    }

    // コードブロック（Prism未適用時のフォールバック）
    pre {
      @apply mb-8 p-4 bg-gray-700 overflow-x-auto rounded-md text-sm sm:text-base;

      code {
        @apply text-gray-50 bg-transparent;
      }
    }

    // コード（Prism適用時）
    .code-toolbar {
      pre {
        @apply mb-8 pt-10 bg-gray-700 overflow-x-auto rounded-md text-sm sm:text-base;

        code {
          @apply px-0;
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
      @apply p-4 bg-gray-100 dark:bg-gray-700 border-l-4 border-gray-400 dark:border-gray-500 rounded;
      word-break: break-word;
      overflow-wrap: break-word;
      p {
        @apply m-0;
      }
    }

    details {
      @apply mb-4;
      summary {
        @apply mb-4 cursor-pointer;
      }
    }

    table {
      @apply mb-4 ml-4 w-full border-collapse rounded-lg overflow-hidden;
      @apply bg-white dark:bg-gray-800;
      @apply shadow-sm;

      th,
      td {
        @apply py-3 px-4;
        @apply border border-gray-200 dark:border-gray-600;
      }

      thead {
        @apply bg-gray-50 dark:bg-gray-700;
        @apply text-gray-700 dark:text-gray-200;
        font-size: 1.05em;
        font-weight: 600;

        th {
          @apply text-left;
          @apply border-b-2 border-gray-200 dark:border-gray-600;
        }
      }

      tbody {
        tr {
          @apply transition-colors duration-150;
          @apply border-b border-gray-100 dark:border-gray-700;

          &:last-child {
            @apply border-b-0;
          }

          &:nth-child(odd) {
            @apply bg-gray-50 dark:bg-gray-900;
          }

          &:nth-child(even) {
            @apply bg-white dark:bg-gray-800;
          }

          &:hover {
            @apply bg-gray-100 dark:bg-gray-700;
          }
        }

        td {
          @apply text-gray-800 dark:text-gray-200;
        }
      }
    }

    // Mermaid diagrams
    .mermaid-container {
      @apply my-8 flex justify-center;

      .mermaid-diagram {
        @apply w-full max-w-full overflow-x-auto;

        .mermaid-fallback {
          @apply bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm;
          @apply text-gray-700 dark:text-gray-300;

          code {
            @apply whitespace-pre-wrap break-words bg-transparent;
            color: inherit;
          }
        }

        &.mermaid-rendered {
          svg {
            @apply mx-auto max-w-full h-auto;

            // テキストを確実に表示
            text,
            tspan,
            .nodeLabel,
            .edgeLabel,
            .label {
              fill: #333 !important;
              color: #333 !important;
            }
          }

          .mermaid-fallback {
            @apply hidden;
          }
        }

        // ダークモード時のテキスト色（neutralテーマのノード背景が明るい前提）
        .dark & svg {
          text,
          tspan,
          .nodeLabel,
          .edgeLabel,
          .label {
            fill: #333 !important;
            color: #333 !important;
          }
        }

        &.mermaid-error .mermaid-fallback {
          @apply border-l-4 border-red-400;
        }
      }
    }
  }
}
</style>
