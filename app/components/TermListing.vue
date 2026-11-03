<script setup lang="ts">
const props = defineProps<{
  kind: 'categories' | 'tags'
  slug: string
  page: number
}>()

const { data } = await usePostIndex()

const term = computed(() => {
  const terms = props.kind === 'categories' ? data.value?.categories : data.value?.tags
  return terms?.find(t => t.slug === props.slug) ?? null
})
if (!term.value) {
  throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })
}

const posts = computed(() => (data.value?.posts ?? []).filter(post =>
  props.kind === 'categories'
    ? post.category?.slug === props.slug
    : post.tags.some(tag => tag.slug === props.slug),
))

const label = computed(() => (props.kind === 'categories' ? term.value!.name : `#${term.value!.name}`))
useSeoMeta({
  title: label.value,
  ogTitle: label.value,
})
</script>

<template>
  <PostListing
    :heading="label"
    :posts="posts"
    :page="page"
    :base-path="`/${kind}/${slug}`"
  />
</template>
