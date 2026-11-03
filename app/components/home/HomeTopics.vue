<script setup lang="ts">
import type { PostMeta, TermWithCount } from '#shared/types/post'

/**
 * TOPICS: a pinned stage that steps through the categories as you scroll.
 * Each switch repaints the stage in pixels of the next category's colour.
 */
const props = defineProps<{ posts: PostMeta[], categories: TermWithCount[] }>()

interface Theme {
  bg: string
  fg: string
  ac: string
}
const ORDER = ['ai', 'programming', 'lifestyle']
const THEMES: Record<string, Theme> = {
  ai: { bg: '#173A3D', fg: '#EEE7DA', ac: '#5CC9BE' },
  programming: { bg: '#DC6A35', fg: '#18120F', ac: '#0D1C1F' },
  lifestyle: { bg: '#E2B04A', fg: '#18120F', ac: '#DC6A35' },
}
const FALLBACK = THEMES.ai!

const topics = computed(() =>
  props.categories
    .filter((category) => category.count > 0)
    .sort((a, b) => rank(a.slug) - rank(b.slug))
    .map((category) => {
      const posts = props.posts.filter((post) => post.category?.slug === category.slug)
      return { ...category, label: category.name.toUpperCase(), posts, tags: countTags(posts) }
    }),
)
function rank(slug: string): number {
  const at = ORDER.indexOf(slug)
  return at < 0 ? ORDER.length : at
}

const sound = useSound()
const scene = ref<HTMLElement | null>(null)
const nameEl = ref<HTMLElement | null>(null)
const wipe = ref<HTMLCanvasElement | null>(null)
const inView = useInView(scene)
/** the category on screen, and the one the scroll asks for */
const shown = ref(0)
let target = 0
let wipeId = 0
const fills = ref<number[]>([])

const topic = computed(() => topics.value[shown.value])
const theme = computed(() => THEMES[topic.value?.slug ?? ''] ?? FALLBACK)
const name = useScrambleText(() => topic.value?.label ?? '')
const stageStyle = computed(() => ({ '--tpbg': theme.value.bg, '--tpfg': theme.value.fg, '--tpac': theme.value.ac }))

function switchTo(i: number) {
  target = i
  const canvas = wipe.value
  const ctx = canvas?.getContext('2d')
  if (motionReduced() || !canvas || !ctx) {
    shown.value = i
    return
  }
  const BLOCK = 22
  const cols = Math.ceil(canvas.clientWidth / BLOCK)
  const rows = Math.ceil(canvas.clientHeight / BLOCK)
  const order = Array.from({ length: cols * rows }, () => Math.random())
  const color = THEMES[topics.value[i]?.slug ?? '']?.bg ?? FALLBACK.bg
  const id = ++wipeId
  const start = performance.now()
  let swapped = false
  canvas.width = cols
  canvas.height = rows
  const step = (now: number) => {
    if (id !== wipeId) return
    const k = (now - start) / 520
    const cover = k < 0.5 ? k * 2 : 1
    const reveal = k < 0.5 ? 0 : (k - 0.5) * 2
    if (k >= 0.5 && !swapped) {
      swapped = true
      shown.value = i
    }
    ctx.clearRect(0, 0, cols, rows)
    ctx.fillStyle = color
    order.forEach((r, m) => {
      if (r < cover && r >= reveal) ctx.fillRect(m % cols, Math.floor(m / cols), 1, 1)
    })
    if (k < 1) requestAnimationFrame(step)
    else ctx.clearRect(0, 0, cols, rows)
  }
  requestAnimationFrame(step)
  sound.tone(260 + i * 90, 0.05)
}

useFrame(({ vh }) => {
  const el = scene.value
  const count = topics.value.length
  if (!inView.value || !el || !count) return
  const p = clamp(-el.getBoundingClientRect().top / Math.max(1, el.offsetHeight - vh), 0, 1)
  const i = Math.min(count - 1, Math.floor(p * count))
  if (i !== target) switchTo(i)
  const sub = p * count - i
  fills.value = topics.value.map((_, n) => (n < i ? 1 : n === i ? sub : 0))
  if (motionReduced() || !nameEl.value) return
  nameEl.value.style.transform = `translate3d(${(6 - sub * 30).toFixed(2)}vw,0,0)`
  nameEl.value.style.fontVariationSettings = `"wght" 840, "wdth" ${(60 + sub * 90).toFixed(1)}`
})
onBeforeUnmount(() => wipeId++)
</script>

<template>
  <section
    id="topics"
    ref="scene"
    class="topics"
    data-tag="<topics/>"
    data-nav="posts"
    aria-labelledby="tp-h"
  >
    <div
      class="tp-stage"
      :style="stageStyle"
    >
      <GrainField :kind="topic?.slug ?? 'ai'" />
      <p
        ref="nameEl"
        class="tp-name"
        aria-hidden="true"
      >
        {{ name }}
      </p>
      <div
        v-if="topic"
        class="tp-in"
      >
        <div class="tp-top">
          <h2 id="tp-h">
            [ TOPICS ]
          </h2>
          <span>{{ padNumber(shown + 1, 2) }} / {{ padNumber(topics.length, 2) }}</span>
          <span
            class="tp-segs"
            aria-hidden="true"
          ><i
            v-for="(t, n) in topics"
            :key="t.slug"
          ><b :style="{ '--f': (fills[n] ?? 0).toFixed(3) }" /></i></span>
        </div>
        <div
          class="tp-body"
          aria-live="polite"
        >
          <div class="tp-count">
            <b>{{ topic.posts.length }}</b><span>{{ topic.posts.length === 1 ? 'POST' : 'POSTS' }} IN {{ topic.label }}</span>
          </div>
          <div class="tp-card chamfer">
            <ul class="tp-tags">
              <li
                v-for="tag in topic.tags"
                :key="tag.slug"
              >
                #{{ tag.name }}<small>{{ tag.count }}</small>
              </li>
            </ul>
            <ol class="tp-list">
              <li
                v-for="post in topic.posts.slice(0, 3)"
                :key="post.slug"
              >
                <NuxtLink
                  class="hov"
                  :to="`/blog/${post.slug}`"
                  data-cursor="READ"
                >
                  <time :datetime="post.publishedAt">{{ formatDate(post.publishedAt) }}</time><span>{{ post.title }}</span>
                </NuxtLink>
              </li>
            </ol>
            <NuxtLink
              class="tp-more"
              :to="`/categories/${topic.slug}`"
              data-cursor="OPEN"
            >
              [ ALL {{ topic.posts.length }} IN {{ topic.label }} ]
            </NuxtLink>
          </div>
        </div>
      </div>
      <canvas
        ref="wipe"
        class="tp-cv"
        aria-hidden="true"
      />
    </div>
  </section>
</template>

<style scoped>
.topics {
  position: relative;
  height: 380vh;
  scroll-margin-top: var(--head);
}
.tp-stage {
  position: sticky;
  top: var(--head);
  height: calc(100vh - var(--head));
  overflow: hidden;
  background: var(--tpbg, var(--deep));
  color: var(--tpfg, var(--ink));
}
.tp-cv {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  pointer-events: none;
  image-rendering: pixelated;
}
.tp-name {
  position: absolute;
  left: 0;
  bottom: 13%;
  z-index: 1;
  margin: 0;
  font-family: var(--f-wide);
  font-variation-settings:
    'wght' 840,
    'wdth' 100;
  font-size: clamp(96px, 22vw, 380px);
  line-height: 0.82;
  letter-spacing: -0.02em;
  white-space: nowrap;
  color: var(--tpac);
  opacity: 0.92;
  will-change: transform;
}
.tp-in {
  position: relative;
  z-index: 2;
  height: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 28px var(--gut-r) 30px max(var(--gut-l), 48px);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 24px;
}
.tp-top {
  display: flex;
  align-items: center;
  gap: 18px;
  font: 400 11px/1 var(--f-px);
  letter-spacing: 0.14em;
}
.tp-top h2 {
  margin: 0;
  font: inherit;
}
.tp-top > * {
  white-space: nowrap;
}
.tp-segs {
  display: flex;
  gap: 4px;
  margin-left: auto;
  width: min(260px, 40vw);
}
.tp-segs i {
  flex: 1;
  height: 4px;
  background: currentColor;
  opacity: 0.2;
}
.tp-segs b {
  display: block;
  height: 100%;
  background: currentColor;
  transform: scaleX(var(--f, 0));
  transform-origin: left;
}
.tp-body {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: 32px 48px;
  align-content: start;
}
.tp-count b {
  display: block;
  font-family: var(--f-wide);
  font-weight: 400;
  font-variation-settings:
    'wght' 300,
    'wdth' 150;
  font-size: clamp(64px, 8vw, 128px);
  line-height: 0.9;
  font-variant-numeric: tabular-nums;
}
.tp-count span {
  font: 400 12px/1 var(--f-px);
  letter-spacing: 0.14em;
}
.tp-card {
  --c: 18px;
  padding: 20px 20px 16px;
  background: var(--base);
  color: var(--ink);
  filter: drop-shadow(0 22px 30px rgba(0, 0, 0, 0.35));
}
.tp-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0 0 22px;
  padding: 0;
  list-style: none;
}
.tp-tags li {
  padding: 7px 10px;
  font: 500 13px/1 var(--f-sans);
  box-shadow: inset 0 0 0 1.5px currentColor;
}
.tp-tags small {
  margin-left: 6px;
  font: 400 10px/1 var(--f-px);
  opacity: 0.7;
}
.tp-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 2px;
}
.tp-list a {
  display: grid;
  grid-template-columns: 7em minmax(0, 1fr);
  gap: 12px;
  padding: 10px 12px;
  color: inherit;
  text-decoration: none;
  background: rgba(238, 231, 218, 0.05);
  transition:
    background 0.2s,
    color 0.2s;
}
.tp-list a:hover {
  background: var(--tpbg);
  color: var(--tpfg);
}
.tp-list time {
  font: 400 11px/1.6 var(--f-mono);
  opacity: 0.8;
}
.tp-list span {
  font: 500 14px/1.6 var(--f-ja);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tp-more {
  display: inline-block;
  margin-top: 14px;
  padding: 9px 12px;
  font: 400 11px/1 var(--f-px);
  letter-spacing: 0.14em;
  text-decoration: none;
  color: var(--ink);
  box-shadow: inset 0 0 0 1px var(--aqua);
}
.tp-more:hover {
  background: var(--aqua);
  color: var(--base);
}
@media (max-width: 860px) {
  .tp-body {
    grid-template-columns: minmax(0, 1fr);
  }
  .tp-list li:nth-child(3) {
    display: none;
  }
}
@media (max-width: 640px) {
  .tp-name {
    bottom: 8%;
  }
  .tp-count b {
    font-size: 56px;
  }
  .tp-tags li:nth-child(n + 7) {
    display: none;
  }
  .tp-segs {
    width: 96px;
  }
  .tp-list a {
    grid-template-columns: minmax(0, 1fr);
    gap: 2px;
  }
}
</style>
