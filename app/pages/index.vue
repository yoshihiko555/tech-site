<script setup lang="ts">
const { data } = await usePostIndex()
const latest = computed(() => (data.value?.posts ?? []).slice(0, 8))

useSeoMeta({
  title: 'Home',
  ogTitle: 'Yoshihiko',
})
</script>

<template>
  <div>
    <h1>Yoshihiko</h1>
    <section>
      <h2>Latest</h2>
      <ol>
        <li
          v-for="post in latest"
          :key="post.slug"
        >
          <NuxtLink :to="`/blog/${post.slug}`">
            {{ post.title }}
          </NuxtLink>
        </li>
      </ol>
      <NuxtLink to="/blog">
        All articles
      </NuxtLink>
    </section>
    <section>
      <h2>Categories</h2>
      <ul>
        <li
          v-for="category in data?.categories"
          :key="category.slug"
        >
          <NuxtLink :to="`/categories/${category.slug}`">
            {{ category.name }} ({{ category.count }})
          </NuxtLink>
        </li>
      </ul>
    </section>
    <section>
      <h2>Tags</h2>
      <ul>
        <li
          v-for="tag in data?.tags"
          :key="tag.slug"
        >
          <NuxtLink :to="`/tags/${tag.slug}`">
            #{{ tag.name }} ({{ tag.count }})
          </NuxtLink>
        </li>
      </ul>
    </section>
  </div>
</template>
