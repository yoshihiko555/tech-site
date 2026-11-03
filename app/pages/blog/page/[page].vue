<script setup lang="ts">
const route = useRoute()
const page = parsePageParam(route.params.page)
if (!page || page < 2) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}
const { data } = await usePostIndex()

useSeoMeta({
  title: `Blog - page ${page}`,
  robots: 'noindex, follow',
})
</script>

<template>
  <PostListing
    heading="All posts"
    :posts="data?.posts ?? []"
    :page="page!"
    base-path="/blog"
  />
</template>
