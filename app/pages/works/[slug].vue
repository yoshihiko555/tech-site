<script setup lang="ts">
import type { CaseStudyBody } from '#shared/types/work'
import { findCaseStudy } from '~/data/caseStudies'

const route = useRoute()
const slug = String(route.params.slug)
const study = findCaseStudy(slug)
const { data: body, error } = await useFetch<CaseStudyBody>(`/api/works/${slug}`, { key: `work-${slug}` })
if (!study || error.value || !body.value) {
  throw createError({ statusCode: 404, statusMessage: 'Case study not found', fatal: true })
}

const headings = computed(() => body.value?.headings ?? [])
const { activeId, activeSubId } = useReadingState(() => headings.value, 'prose')

const { origin } = useRuntimeConfig().public
const title = `${study.name} — Case Study`
useSeoMeta({
  title,
  description: study.lede,
  ogTitle: title,
  ogDescription: study.lede,
  ogType: 'article',
  ogUrl: `${origin}/works/${slug}`,
  ogImage: `${origin}${study.image}`,
  twitterTitle: title,
  twitterDescription: study.lede,
  twitterImage: `${origin}${study.image}`,
})
</script>

<template>
  <div v-if="study && body">
    <CaseHead
      :study="study"
      :reading-minutes="body.readingMinutes"
    />
    <div class="alayout">
      <ArticleToc
        variant="rail"
        :headings="headings"
        :active-id="activeId"
        :active-sub-id="activeSubId"
      />
      <div class="column">
        <ArticleToc
          variant="menu"
          :headings="headings"
        />
        <ArticleBody
          id="prose"
          :html="body.html"
        />
        <nav
          class="cend"
          aria-label="Case study"
        >
          <BracketButton
            label="← ALL WORKS"
            to="/#works"
            cursor="BACK"
          />
          <BracketButton
            label="SOURCE ↗"
            :to="study.source"
            cursor="GITHUB"
          />
        </nav>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* same columns as the article page */
.alayout {
  max-width: 1180px;
  margin: 0 auto;
  padding-left: var(--gut-l);
  padding-right: var(--gut-r);
  padding-block: 56px 40px;
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr);
  gap: 56px;
}
.column {
  min-width: 0;
}
.cend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 56px;
  padding-top: 24px;
  border-top: 1px solid var(--line);
}
@media (max-width: 980px) {
  .alayout {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
  }
}
</style>
