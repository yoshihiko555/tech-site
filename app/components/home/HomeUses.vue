<script setup lang="ts">
import type { PostMeta } from '#shared/types/post'
import { USES, USES_SOURCES } from '~/data/uses'

/** USES: overlapping cards of the tools in daily use; each drifts at its own speed. */
const props = defineProps<{ posts: PostMeta[] }>()

const sources = computed(() =>
  USES_SOURCES.map((slug) => props.posts.find((post) => post.slug === slug)).filter((post): post is PostMeta => !!post),
)

const section = ref<HTMLElement | null>(null)
const cards = ref<HTMLElement[]>([])
const word = ref<{ row: HTMLElement | null } | null>(null)
const inView = useInView(section)

useFrame(({ vh }) => {
  const el = section.value
  if (!inView.value || !el) return
  const top = el.getBoundingClientRect().top
  const p = clamp((vh - top) / (vh + el.offsetHeight), 0, 1)
  if (word.value?.row) word.value.row.style.transform = `translate3d(${(8 - p * 40).toFixed(2)}vw,0,0)`
  cards.value.forEach((card, i) => {
    card.style.setProperty('--py', `${((p - 0.5) * vh * USES[i]!.speed * 2).toFixed(1)}px`)
  })
})
</script>

<template>
  <section
    id="uses"
    ref="section"
    class="uses"
    data-tag="<uses/>"
    data-nav="status"
    aria-labelledby="uses-h"
  >
    <div
      class="uses-bg"
      aria-hidden="true"
    >
      <GiantRow
        ref="word"
        :words="['USES', 'USES', 'USES']"
        outline
      />
    </div>
    <HomeContainer>
      <SectionHead
        id="uses-h"
        title="USES"
        meta="TOOLS I WRITE ABOUT"
      />
      <div class="u-stack">
        <article
          v-for="(card, i) in USES"
          :key="card.title"
          ref="cards"
          class="u-card chamfer"
          :class="[`u-${card.tone}`, `u${i + 1}`]"
        >
          <h3>[ {{ card.title }} ]</h3>
          <ul>
            <li
              v-for="item in card.items"
              :key="item.name"
            >
              {{ item.name }}<small v-if="item.note">{{ item.note }}</small>
            </li>
          </ul>
        </article>
      </div>
      <p
        v-if="sources.length"
        class="u-src"
      >
        FROM:
        <template
          v-for="(post, i) in sources"
          :key="post.slug"
        >
          <template v-if="i">
            /
          </template>
          <NuxtLink
            class="hov"
            :to="`/blog/${post.slug}`"
            data-cursor="READ"
          >
            {{ post.title }}
          </NuxtLink>
        </template>
      </p>
    </HomeContainer>
  </section>
</template>

<style scoped>
.uses {
  position: relative;
  overflow: hidden;
  background: var(--base);
  scroll-margin-top: var(--head);
}
.uses-bg {
  position: absolute;
  left: 0;
  right: 0;
  top: 46%;
  pointer-events: none;
  --g-size: clamp(120px, 30vw, 520px);
  --g-stroke: rgba(92, 201, 190, 0.22);
}
.u-stack {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: start;
  padding: 10px 0 40px;
}
.u-card {
  position: relative;
  padding: 18px 20px 20px;
  --c: 16px;
  transform: translate3d(0, var(--py, 0px), 0) rotate(var(--r, 0deg));
  transition:
    box-shadow 0.3s,
    filter 0.3s;
  filter: drop-shadow(0 18px 24px rgba(0, 0, 0, 0.35));
}
.u-card:hover {
  z-index: 5;
  filter: drop-shadow(0 22px 30px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 1px var(--aqua));
}
.u-card h3 {
  margin: 0 0 14px;
  font: 400 11px/1 var(--f-px);
  letter-spacing: 0.14em;
}
.u-card ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
}
.u-card li {
  font: 600 clamp(17px, 1.7vw, 22px)/1.15 var(--f-sans);
}
.u-card li small {
  display: block;
  margin-top: 3px;
  font: 400 11px/1.3 var(--f-mono);
  opacity: 0.72;
}
.u-dark {
  background: var(--base-2);
  color: var(--ink);
  box-shadow: inset 0 0 0 1.5px rgba(92, 201, 190, 0.35);
}
.u-warm {
  background: var(--warm);
  color: #18120f;
}
.u-mustard {
  background: var(--mustard);
  color: #18120f;
}
.u-teal {
  background: var(--deep);
  color: var(--ink);
  box-shadow: inset 0 0 0 1.5px var(--warm);
}
.u1 {
  grid-column: 1;
  grid-row: 1;
  margin: 34px 0 0;
  --r: -2.5deg;
}
.u2 {
  grid-column: 2;
  grid-row: 1 / 3;
  margin: 84px -16px 0 -20px;
  --r: 1.5deg;
  z-index: 2;
}
.u3 {
  grid-column: 3;
  grid-row: 1;
  margin: 0 0 0 4px;
  --r: -1deg;
}
.u4 {
  grid-column: 1;
  grid-row: 2;
  margin: 26px -6px 0 30px;
  --r: 2deg;
  z-index: 1;
}
.u5 {
  grid-column: 3;
  grid-row: 2;
  margin: 30px 18px 0 10px;
  --r: -2deg;
}
.u-src {
  margin: 18px 0 0;
  font: 400 11px/1.7 var(--f-mono);
  color: var(--dim);
}
.u-src a {
  color: var(--ink);
}
@media (max-width: 860px) {
  .u-stack {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
  }
  .u-card {
    grid-column: auto !important;
    grid-row: auto !important;
    margin-top: -8px;
    --r: 0deg !important;
  }
  .u-card:nth-child(odd) {
    margin-right: 18px;
  }
  .u-card:nth-child(even) {
    margin-left: 18px;
  }
}
</style>
