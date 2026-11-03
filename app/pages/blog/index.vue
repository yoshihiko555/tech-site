<script setup lang="ts">
const { data } = await usePostIndex()

useSeoMeta({
  title: 'Blog',
  ogTitle: 'Blog',
})
</script>

<template>
  <PostListing
    heading="All posts"
    :posts="data?.posts ?? []"
    :page="1"
    base-path="/blog"
  />
</template>
