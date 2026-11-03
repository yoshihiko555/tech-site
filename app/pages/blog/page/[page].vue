<script setup lang="ts">
const route = useRoute()
const page = parsePageParam(route.params.page)
if (!page || page < 2) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}
useSeoMeta({ robots: 'noindex, follow' })
</script>

<template>
  <PostListing
    kind="all"
    :page="page!"
  />
</template>
