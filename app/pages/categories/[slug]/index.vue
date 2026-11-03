<script setup lang="ts">
const route = useRoute()
const slug = String(route.params.slug)
</script>

<template>
  <TermListing
    kind="categories"
    :slug="slug"
    :page="1"
  />
</template>
