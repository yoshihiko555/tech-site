<script setup lang="ts">
import type { PostMeta, TermWithCount } from '#shared/types/post'
import { WORKS } from '~/data/works'

/** NUMBERS: counts from the live site, posts per year and the most used tags. */
const props = defineProps<{ posts: PostMeta[], categories: TermWithCount[], tags: TermWithCount[] }>()

/** tags in use (Contentful can hold tags no post carries) */
const usedTags = computed(() => props.tags.filter((tag) => tag.count > 0))

/** tags used at least this often get a bar; the rest are listed below */
const BAR_MIN = 3

const buildYear = useBuildYear()
const tiles = computed(() => [
  { n: props.posts.length, label: 'POSTS' },
  { n: usedTags.value.length, label: 'TAGS' },
  { n: props.categories.filter((c) => c.count > 0).length, label: 'CATEGORIES' },
  { n: WORKS.length, label: 'WORKS' },
])
const years = computed(() => countByYear(props.posts, buildYear.value))
const yearMax = computed(() => Math.max(1, ...years.value.map((y) => y.count)))
const barTags = computed(() => usedTags.value.filter((tag) => tag.count >= BAR_MIN))
const restTags = computed(() => usedTags.value.filter((tag) => tag.count < BAR_MIN))
const tagMax = computed(() => Math.max(1, usedTags.value[0]?.count ?? 1))
const postsLabel = (n: number) => `${n} ${n === 1 ? 'POST' : 'POSTS'}`

const section = ref<HTMLElement | null>(null)
const inView = useInView(section)
/** 0..1 as the section scrolls in (1 on the server and with reduced motion) */
const progress = ref(1)
const streams = ref<string[]>([])

function hexStream(): string {
  const lines = Array.from({ length: 40 }, () =>
    Math.floor(Math.random() * 65535)
      .toString(16)
      .toUpperCase()
      .padStart(4, '0'),
  ).join('\n')
  return `${lines}\n${lines}\n`
}

useFrame(({ vh }) => {
  if (!inView.value || !section.value || prefersReducedMotion()) return
  const top = section.value.getBoundingClientRect().top
  const next = Number(clamp((0.95 * vh - top) / (vh * 0.75), 0, 1).toFixed(3))
  if (next !== progress.value) progress.value = next
})

onMounted(() => {
  streams.value = tiles.value.map(hexStream)
  if (!prefersReducedMotion()) progress.value = 0
})
</script>

<template>
  <section
    id="numbers"
    ref="section"
    class="nums"
    data-tag="<numbers/>"
    data-nav="posts"
    aria-labelledby="nums-h"
    :style="{ '--p': progress }"
  >
    <HomeContainer>
      <SectionHead
        id="nums-h"
        title="NUMBERS"
        meta="FROM THE LIVE SITE"
      />
      <div class="n-tiles">
        <div
          v-for="(tile, i) in tiles"
          :key="tile.label"
          class="n-tile"
        >
          <pre aria-hidden="true">{{ streams[i] }}</pre>
          <b :style="{ fontVariationSettings: `'wght' ${(200 + progress * 500).toFixed(0)}, 'wdth' ${(60 + progress * 90).toFixed(1)}` }">{{
            Math.round(tile.n * progress)
          }}</b><span>{{ tile.label }}</span>
        </div>
      </div>
      <div class="n-charts">
        <figure class="n-chart chamfer">
          <figcaption>[ POSTS PER YEAR ]</figcaption>
          <div
            class="yr-bars"
            aria-hidden="true"
            :style="{ gridTemplateColumns: `repeat(${years.length}, minmax(0, 1fr))` }"
          >
            <div
              v-for="y in years"
              :key="y.year"
              class="yr"
              :class="{ zero: !y.count }"
              :data-cursor="`${y.year} / ${postsLabel(y.count)}`"
              :style="{ '--h': (y.count / yearMax).toFixed(3) }"
            >
              <em v-if="y.count">{{ y.count }}</em><i />
            </div>
          </div>
          <div
            class="yr-x"
            aria-hidden="true"
            :style="{ gridTemplateColumns: `repeat(${years.length}, minmax(0, 1fr))` }"
          >
            <span
              v-for="y in years"
              :key="y.year"
            >{{ y.year }}</span>
          </div>
          <table class="sr-only">
            <caption>Posts per year</caption>
            <tbody>
              <tr>
                <th>Year</th><th>Posts</th>
              </tr>
              <tr
                v-for="y in years"
                :key="y.year"
              >
                <td>{{ y.year }}</td><td>{{ y.count }}</td>
              </tr>
            </tbody>
          </table>
        </figure>
        <figure class="n-chart chamfer">
          <figcaption>[ TOP TAGS ]</figcaption>
          <div class="tag-bars">
            <div
              v-for="tag in barTags"
              :key="tag.slug"
              class="tb"
              :data-cursor="`${tag.name} / ${tag.count}`"
              :style="{ '--w': (tag.count / tagMax).toFixed(3) }"
            >
              <span>{{ tag.name }}</span><i /><em>{{ tag.count }}</em>
            </div>
          </div>
          <ul class="more-tags">
            <li
              v-for="tag in restTags"
              :key="tag.slug"
            >
              #{{ tag.name }} {{ tag.count }}
            </li>
          </ul>
        </figure>
      </div>
    </HomeContainer>
  </section>
</template>

<style scoped>
.nums {
  position: relative;
  background: var(--base);
  scroll-margin-top: var(--head);
}
.n-tiles {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 2px;
  margin-bottom: 28px;
}
.n-tile {
  position: relative;
  padding: 22px 20px 18px;
  background: var(--base-2);
  overflow: hidden;
}
.n-tile b {
  position: relative;
  display: block;
  font-family: var(--f-wide);
  font-weight: 400;
  font-size: clamp(54px, 7vw, 108px);
  line-height: 0.9;
  font-variant-numeric: tabular-nums;
  color: var(--ink);
}
.n-tile span {
  position: relative;
  display: block;
  margin-top: 12px;
  font: 400 11px/1 var(--f-px);
  letter-spacing: 0.14em;
  color: var(--warm);
}
.n-tile pre {
  position: absolute;
  right: 10px;
  top: 0;
  margin: 0;
  font: 400 9px/1.35 var(--f-mono);
  color: var(--aqua);
  opacity: 0.35;
  animation: hexrun 9s linear infinite;
}
@keyframes hexrun {
  to {
    transform: translateY(-50%);
  }
}
.n-charts {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 18px;
}
.n-chart {
  margin: 0;
  padding: 20px 20px 18px;
  background: var(--base-2);
  --c: 16px;
}
.n-chart figcaption {
  margin-bottom: 18px;
  font: 400 11px/1 var(--f-px);
  letter-spacing: 0.14em;
  color: var(--ink);
}
.yr-bars {
  display: grid;
  gap: 2px;
  height: 220px;
  align-items: end;
  border-bottom: 1px solid rgba(159, 178, 174, 0.35);
}
.yr {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
}
.yr i {
  display: block;
  width: 58%;
  height: calc(var(--h) * var(--p, 0) * 100%);
  min-height: 2px;
  background: var(--warm);
}
.yr.zero i {
  background: rgba(159, 178, 174, 0.45);
}
.yr em {
  margin-bottom: 6px;
  font: normal 400 12px/1 var(--f-mono);
  color: var(--ink);
  opacity: var(--p, 0);
}
.yr:hover i {
  background: var(--ink);
}
.yr-x {
  display: grid;
  gap: 2px;
  margin-top: 8px;
  font: 400 10px/1 var(--f-mono);
  color: var(--dim);
  text-align: center;
}
.tag-bars {
  display: grid;
  gap: 2px;
}
.tb {
  display: grid;
  grid-template-columns: 12em minmax(0, 1fr) 2.2em;
  align-items: center;
  gap: 10px;
  padding: 4px 0;
  font: 500 13px/1.3 var(--f-sans);
  color: var(--ink);
}
.tb > span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tb i {
  display: block;
  height: 12px;
  width: calc(var(--w) * var(--p, 0) * 100%);
  min-width: 2px;
  background: var(--warm);
}
.tb em {
  font: normal 400 12px/1 var(--f-mono);
  text-align: right;
}
.tb:hover i {
  background: var(--ink);
}
.more-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 16px 0 0;
  padding: 14px 0 0;
  list-style: none;
  border-top: 1px dashed rgba(159, 178, 174, 0.3);
}
.more-tags li {
  padding: 5px 8px;
  font: 400 12px/1 var(--f-sans);
  color: var(--dim);
  box-shadow: inset 0 0 0 1px rgba(159, 178, 174, 0.3);
}
@media (max-width: 860px) {
  .n-charts {
    grid-template-columns: minmax(0, 1fr);
  }
  .n-tiles {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .tb {
    grid-template-columns: 9em minmax(0, 1fr) 2em;
  }
}
@media (prefers-reduced-motion: reduce) {
  .n-tile pre {
    animation: none;
  }
}
</style>
