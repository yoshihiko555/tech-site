<script setup lang="ts">
definePageMeta({ layout: 'home' })

const LATEST = 8

const { data } = await usePostIndex()
const posts = computed(() => data.value?.posts ?? [])
const latest = computed(() => posts.value.slice(0, LATEST))
const lastPost = computed(() => formatDate(posts.value[0]?.publishedAt ?? ''))

// every category and tag page is generated, even those no page links to any more
// (a tag without posts still has its URL from the old site)
if (import.meta.server) {
  prerenderRoutes([
    ...(data.value?.categories ?? []).map((term) => `/categories/${term.slug}`),
    ...(data.value?.tags ?? []).map((term) => `/tags/${term.slug}`),
  ])
}

const page = ref<HTMLElement | null>(null)
useHomeSections(page)
useHomeSounds()

useSeoMeta({
  title: 'Home',
  ogTitle: 'Yoshihiko',
})
useHead({
  script: [
    {
      // before first paint: no intro when landing on a #section
      key: 'intro-gate',
      tagPosition: 'head',
      // (a style tag rather than a class on <html>, which hydration may rewrite)
      innerHTML:
        'if(location.hash){var s=document.createElement("style");s.textContent=".loader{display:none}";document.head.appendChild(s)}',
    },
  ],
  noscript: [{ key: 'intro-off', innerHTML: '<style>.loader{display:none}</style>' }],
})
</script>

<template>
  <div ref="page">
    <HomeIntro :latest-count="latest.length" />
    <HomeHero :last-post="lastPost" />
    <HomeGiant />
    <HomeStatus :post-count="posts.length" />
    <HomeColorSwitch :post-count="posts.length" />
    <HomeWriting :posts="latest" />
    <HomeTopics
      :posts="posts"
      :categories="data?.categories ?? []"
    />
    <HomeNumbers
      :posts="posts"
      :categories="data?.categories ?? []"
      :tags="data?.tags ?? []"
    />
    <HomeEpisodes />
    <HomeUses :posts="posts" />
    <HomeWorks />
  </div>
</template>
