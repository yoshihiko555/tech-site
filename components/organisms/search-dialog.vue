<template>
  <vs-dialog
    ref="root"
    class="search-dialog"
    :value="open"
    @input="$emit('update:open', false)"
  >
    <template #header>
      <div class="flex items-center gap-3">
        <i class="bx bx-search text-xl text-site-theme" />
        <h3 class="text-xl font-semibold">Search</h3>
      </div>
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
      <div v-if="articles && articles.length" class="result-wrapper">
        <nuxt-link
          class="article-card"
          v-for="article in articles"
          :key="article && article.sys.id"
          :to="`/blog/${article && article.slug}`"
          @click.native="$emit('update:open', false)"
        >
          <h3 class="mb-2 text-base font-medium leading-snug">{{ article && article.title }}</h3>
          <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span class="px-2 py-0.5 rounded-md text-xs bg-gray-100 dark:bg-site-black-back">{{ article && article.category && article.category.name }}</span>
            <span>{{ $moment(article && article.sys.publishedAt).format('MMM Do YYYY') }}</span>
          </div>
        </nuxt-link>
      </div>
      <div v-else-if="variables.value && !loading" class="no-result">
        <p class="text-gray-400 dark:text-gray-500">No results found.</p>
      </div>
    </div>
  </vs-dialog>
</template>

<script lang='ts'>
import { defineComponent, reactive, computed, watch, toRefs, nextTick, onBeforeUnmount } from '@nuxtjs/composition-api'
import { useResult } from '@vue/apollo-composable'
import { useSearchArticlesQuery, SearchArticlesQueryVariables } from '~/generated/graphql'
export default defineComponent({
  props: {
    open: {
      type: Boolean,
    }
  },
  setup (props, { refs, emit }) {
    const { open } = toRefs(props)

    // ESC キーでモーダルを閉じる（グローバル）
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        emit('update:open', false)
      }
    }

    // ダイアログが開いたときに入力欄にフォーカス + ESC リスナー登録
    watch(open, (now) => {
      if (now) {
        document.addEventListener('keydown', handleEsc)
        nextTick(() => {
          const parent = refs.input as Vue
          if (parent && parent.$el) {
            const input = parent.$el.querySelector('input')
            if (input instanceof HTMLInputElement) {
              input.focus()
            }
          }
        })
      } else {
        document.removeEventListener('keydown', handleEsc)
      }
    })

    onBeforeUnmount(() => {
      document.removeEventListener('keydown', handleEsc)
    })

    // 検索ロジック
    const variables = reactive<SearchArticlesQueryVariables>({
      value: ''
    })
    const enabled = computed(() => variables.value.length > 0)
    const { result, loading } = useSearchArticlesQuery(variables, () => ({
      enabled: enabled.value,
    }))
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
// ダイアログ全体のカスタマイズ
.search-dialog::v-deep {
  .vs-dialog-content {
    max-width: 640px;
    width: 90vw;

    @include sm {
      width: 80vw;
    }

    @include md {
      width: 640px;
    }
  }

  .vs-dialog {
    @apply rounded-2xl;
  }

  // バックドロップに blur 効果
  .vs-dialog__overlay {
    backdrop-filter: blur(4px);
  }

  .vs-dialog__header {
    @apply pb-2;
  }

  .vs-dialog__content {
    @apply px-6 pb-6;
  }
}

// 検索入力フィールド
.vs-input-parent::v-deep .vs-input-content {
  @apply w-full;

  .vs-input {
    @apply w-full text-base;
  }
}

// 検索結果リスト
.result-wrapper {
  @apply mt-4 overflow-y-auto;
  max-height: calc(60vh - 120px);

  @include sm {
    max-height: calc(70vh - 140px);
  }

  .article-card {
    @apply block px-4 py-4 rounded-xl transition-all duration-200 bg-white dark:bg-site-black;
    @apply hover:bg-gray-50 dark:hover:bg-site-black-theme;
    @apply shadow-sm hover:shadow-md;

    & + .article-card {
      @apply mt-3;
    }
  }
}

// 結果なしメッセージ
.no-result {
  @apply mt-6 text-center;
}

// カスタムスクロールバー
::-webkit-scrollbar {
  @apply w-1.5;
}

::-webkit-scrollbar-track {
  @apply bg-transparent;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-300 dark:bg-gray-600 rounded-full;

  &:hover {
    @apply bg-gray-400 dark:bg-gray-500;
  }
}
</style>
