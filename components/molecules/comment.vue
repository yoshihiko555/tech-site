<template>
  <section class="comment-section">
    <h3 class="comment-section__title">Comments</h3>
    <p v-if="!isConfigured" class="comment-section__notice">
      コメント機能は現在準備中です。`GISCUS_REPO` / `GISCUS_REPO_ID` / `GISCUS_CATEGORY` / `GISCUS_CATEGORY_ID` を設定すると有効化されます。
    </p>
    <p v-else-if="status === 'loading'" class="comment-section__notice">
      コメントを読み込み中です...
    </p>
    <p v-else-if="status === 'error'" class="comment-section__error">
      コメントの読み込みに失敗しました。広告ブロッカー無効化・Discussions有効化・giscus設定値の再確認をしてください。
    </p>
    <div v-if="isConfigured" ref="container" class="giscus giscus-container" />
  </section>
</template>

<script lang='ts'>
import { computed, defineComponent, nextTick, onBeforeUnmount, onMounted, ref, useContext, watch } from '@nuxtjs/composition-api'

type LoadStatus = 'idle' | 'loading' | 'ready' | 'error'

export default defineComponent({
  props: {
    slug: {
      type: String,
      required: true,
    },
  },
  setup (props) {
    const { $config } = useContext()
    const container = ref<HTMLElement | null>(null)
    const status = ref<LoadStatus>('idle')
    let timeoutId: number | null = null
    let observer: MutationObserver | null = null
    const config = computed(() => ({
      repo: $config.giscusRepo || '',
      repoId: $config.giscusRepoId || '',
      category: $config.giscusCategory || '',
      categoryId: $config.giscusCategoryId || '',
      theme: $config.giscusTheme || 'preferred_color_scheme',
    }))
    const isConfigured = computed(() => {
      return Boolean(config.value.repo && config.value.repoId && config.value.category && config.value.categoryId)
    })

    const clearLoaderState = () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId)
        timeoutId = null
      }
      if (observer) {
        observer.disconnect()
        observer = null
      }
    }

    const mountGiscus = () => {
      if (!process.client || !container.value || !isConfigured.value) return
      const target = container.value
      clearLoaderState()
      status.value = 'loading'
      target.innerHTML = ''

      observer = new MutationObserver(() => {
        const frame = target.querySelector('iframe.giscus-frame') as HTMLIFrameElement | null
        if (!frame) return

        frame.style.minHeight = '320px'

        frame.addEventListener('load', () => {
          status.value = 'ready'
          clearLoaderState()
        }, { once: true })

        frame.addEventListener('error', () => {
          status.value = 'error'
          clearLoaderState()
        }, { once: true })

        observer?.disconnect()
        observer = null
      })
      observer.observe(target, { childList: true, subtree: true })

      timeoutId = window.setTimeout(() => {
        if (status.value !== 'ready') {
          status.value = 'error'
          clearLoaderState()
        }
      }, 8000)

      const script = document.createElement('script')
      script.src = 'https://giscus.app/client.js'
      script.async = true
      script.crossOrigin = 'anonymous'
      script.onerror = () => {
        status.value = 'error'
        clearLoaderState()
      }
      script.setAttribute('data-repo', config.value.repo)
      script.setAttribute('data-repo-id', config.value.repoId)
      script.setAttribute('data-category', config.value.category)
      script.setAttribute('data-category-id', config.value.categoryId)
      script.setAttribute('data-mapping', 'pathname')
      script.setAttribute('data-strict', '0')
      script.setAttribute('data-reactions-enabled', '0')
      script.setAttribute('data-emit-metadata', '0')
      script.setAttribute('data-input-position', 'bottom')
      script.setAttribute('data-theme', config.value.theme)
      script.setAttribute('data-lang', 'ja')
      script.setAttribute('data-loading', 'eager')

      target.appendChild(script)
    }

    onMounted(async () => {
      await nextTick()
      mountGiscus()
    })

    watch(
      () => props.slug,
      () => {
        mountGiscus()
      }
    )

    onBeforeUnmount(() => {
      clearLoaderState()
    })

    return {
      isConfigured,
      container,
      status,
    }
  }
})
</script>

<style lang="scss" scoped>
.comment-section {
  @apply mt-16 pt-10 border-t border-gray-200 dark:border-gray-700;
}

.comment-section__title {
  @apply mb-6 text-xl sm:text-2xl font-bold;
}

.comment-section__notice {
  @apply text-sm text-gray-500 dark:text-gray-300;
}

.comment-section__error {
  @apply text-sm text-red-600 dark:text-red-400;
}

.giscus-container {
  min-height: 320px;
}

.comment-section::v-deep .giscus-frame {
  width: 100% !important;
  min-height: 420px !important;
}
</style>
