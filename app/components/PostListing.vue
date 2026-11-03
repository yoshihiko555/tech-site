<script setup lang="ts">
import type { PostMeta } from '#shared/types/post'
import type { Crumb } from './listing/ListHeader.vue'

const props = defineProps<{
  kind: 'all' | 'categories' | 'tags'
  slug?: string
  page: number
}>()

const { data } = await usePostIndex()

const term = computed(() => {
  if (props.kind === 'all') return null
  const terms = props.kind === 'categories' ? data.value?.categories : data.value?.tags
  return terms?.find(t => t.slug === props.slug) ?? null
})
if (props.kind !== 'all' && !term.value) {
  throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })
}

const scope = computed<PostMeta[]>(() => {
  const posts = data.value?.posts ?? []
  if (props.kind === 'categories') return posts.filter(post => post.category?.slug === props.slug)
  if (props.kind === 'tags') return posts.filter(post => post.tags.some(tag => tag.slug === props.slug))
  return posts
})
const pages = computed(() => countPages(scope.value.length))
if (props.page > pages.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const title = computed(() => {
  if (props.kind === 'categories') return term.value!.name.toUpperCase()
  if (props.kind === 'tags') return `#${term.value!.name}`
  return 'ALL POSTS'
})
const basePath = computed(() => (props.kind === 'all' ? '/blog' : `/${props.kind}/${props.slug}`))
const crumbs = computed<Crumb[]>(() => {
  const root: Crumb = { label: '<writing/>', to: '/blog' }
  if (props.kind === 'categories') return [root, { label: 'CATEGORY' }, { label: title.value }]
  if (props.kind === 'tags') return [root, { label: 'TAG' }, { label: title.value }]
  return [root, { label: 'ALL' }]
})

/** grep searches the whole scope (title and tags), not only this page */
const query = ref('')
const matches = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return scope.value
  return scope.value.filter(post =>
    `${post.title} ${post.tags.map(tag => tag.name).join(' ')}`.toLowerCase().includes(q),
  )
})
const searching = computed(() => query.value.trim() !== '')
const shown = computed(() => (searching.value ? matches.value : slicePage(scope.value, props.page)))
const count = computed(() => (searching.value ? matches.value.length : scope.value.length))
const countLabel = computed(() => {
  if (searching.value) return 'MATCHES'
  const noun = scope.value.length === 1 ? 'POST' : 'POSTS'
  return pages.value > 1 ? `${noun} / PAGE ${props.page} OF ${pages.value}` : noun
})

const pageTitle = computed(() => (props.kind === 'all' ? 'Blog' : title.value))
useSeoMeta({
  title: () => (props.page > 1 ? `${pageTitle.value} - page ${props.page}` : pageTitle.value),
  ogTitle: () => pageTitle.value,
})
</script>

<template>
  <div>
    <ListHeader
      v-model:query="query"
      :crumbs="crumbs"
      :title="title"
      :count="count"
      :count-label="countLabel"
    />
    <div class="lwrap">
      <ListFilters
        :total="data?.posts.length ?? 0"
        :categories="data?.categories ?? []"
        :tags="data?.tags ?? []"
        :current-category="kind === 'categories' ? slug : undefined"
        :current-tag="kind === 'tags' ? slug : undefined"
      />
      <PostRows
        v-if="shown.length"
        :key="`${basePath}-${page}-${searching}`"
        :posts="shown"
        :matches="matches"
        :query="query"
      />
      <p
        v-else-if="searching"
        class="empty"
      >
        No posts match “{{ query.trim() }}” in {{ title }}. Clear the search to see all of them.
        <button
          type="button"
          @click="query = ''"
        >
          CLEAR SEARCH
        </button>
      </p>
      <p
        v-else
        class="empty"
      >
        No posts in {{ title }} yet.
        <NuxtLink to="/blog">
          SEE ALL POSTS
        </NuxtLink>
      </p>
      <ListPager
        v-if="!searching"
        :page="page"
        :pages="pages"
        :base-path="basePath"
      />
    </div>
  </div>
</template>

<style scoped>
.lwrap {
  max-width: 1180px;
  margin: 0 auto;
  padding-left: var(--gut-l);
  padding-right: var(--gut-r);
  padding-block: 28px 72px;
  display: grid;
  gap: 22px;
}
.empty {
  margin: 0;
  padding: 28px 22px;
  display: grid;
  gap: 14px;
  justify-items: start;
  background: var(--base-2);
  font: 500 15px/1.8 var(--f-ja);
  color: var(--ink);
}
.empty button {
  padding: 10px 14px;
  font: 400 11px/1 var(--f-px);
  letter-spacing: 0.14em;
  color: var(--ink);
  background: transparent;
  border: 0;
  box-shadow: inset 0 0 0 1px var(--warm);
  cursor: pointer;
}
.empty a {
  font: 400 11px/1 var(--f-px);
  letter-spacing: 0.14em;
  color: var(--aqua);
}
</style>
