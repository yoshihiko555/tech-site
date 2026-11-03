<script setup lang="ts">
import { EPISODES } from '~/data/career'

/**
 * EPISODES: the career as a horizontal track that the vertical scroll drives,
 * episodes turning slightly in 3D as they pass the reading line.
 */
const sound = useSound()
const section = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const bar = ref<HTMLElement | null>(null)
const inView = useInView(section, '0px')
const current = ref(0)
let eased = 0

useFrame(({ y, vh }) => {
  const el = section.value
  const row = track.value
  if (!inView.value || !el || !row) return
  const reduced = motionReduced()
  const top = el.getBoundingClientRect().top + y
  const p = clamp((y - top) / Math.max(1, el.offsetHeight - vh), 0, 1)
  eased = reduced ? p : eased + (p - eased) * 0.09
  const vw = document.documentElement.clientWidth
  const distance = Math.max(0, row.scrollWidth - vw * 0.7)
  row.style.transform = `translate3d(${(-eased * distance).toFixed(1)}px,0,0)`
  if (bar.value) bar.value.style.transform = `scaleX(${eased.toFixed(4)})`
  let best = 0
  let bestDistance = Infinity
  ;[...row.children].forEach((child, j) => {
    const box = child.getBoundingClientRect()
    const d = (box.left + box.width / 2 - vw * 0.42) / (vw * 0.5)
    if (Math.abs(d) < bestDistance) {
      bestDistance = Math.abs(d)
      best = j
    }
    const item = child as HTMLElement
    if (reduced) return
    const away = Math.min(Math.abs(d), 1.4)
    item.style.transform = `rotateY(${(clamp(d, -1.4, 1.4) * -16).toFixed(2)}deg) translateZ(${(-away * 100).toFixed(1)}px)`
    item.style.opacity = (1 - Math.min(away, 1.2) * 0.55).toFixed(3)
  })
  if (best !== current.value) {
    current.value = best
    sound.tone(740, 0.07)
  }
})
</script>

<template>
  <section
    id="episodes"
    ref="section"
    class="eps"
    data-tag="<log/>"
    data-nav="episodes"
    data-dim="0.85"
    aria-labelledby="eps-h"
  >
    <div class="eps-sticky">
      <div class="eps-head">
        <SectionHead
          id="eps-h"
          title="EPISODES"
          meta="EPISODE"
        >
          <template #meta>
            EPISODE {{ padNumber(current + 1, 2) }} / {{ padNumber(EPISODES.length, 2) }}
          </template>
        </SectionHead>
      </div>
      <div
        ref="track"
        class="eps-track"
      >
        <article
          v-for="(episode, i) in EPISODES"
          :key="episode.when"
          class="ep"
          :class="{ on: i === current }"
        >
          <span class="no">EPISODE {{ padNumber(i + 1, 2) }}<em :class="{ wip: !episode.done }">{{
            episode.done ? 'CLEAR' : 'IN PROGRESS'
          }}</em></span>
          <b>{{ episode.when }}</b>
          <h3>{{ episode.title }}</h3>
        </article>
      </div>
      <div
        class="eps-bar"
        aria-hidden="true"
      >
        <span ref="bar" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.eps {
  position: relative;
  height: 340vh;
  scroll-margin-top: var(--head);
}
.eps-sticky {
  position: sticky;
  top: calc(var(--head) + env(safe-area-inset-top, 0px));
  height: calc(100vh - var(--head) - env(safe-area-inset-top, 0px));
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: auto minmax(0, 1fr) auto;
  perspective: 1400px;
}
.eps-head {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: max(var(--gut-l), 48px);
  padding-right: var(--gut-r);
  padding-top: 30px;
  color: var(--ink);
}
.eps-head :deep(.sec-head) {
  margin-bottom: 0;
}
.eps-track {
  justify-self: start;
  display: flex;
  align-items: center;
  gap: 7vw;
  width: max-content;
  padding-left: max(var(--gut-l), calc((100vw - 1200px) / 2 + 48px));
  padding-right: 30vw;
  transform-style: preserve-3d;
  will-change: transform;
}
.ep {
  width: min(62vw, 540px);
  display: grid;
  gap: 12px;
  justify-items: start;
  transform-style: preserve-3d;
  will-change: transform, opacity;
}
.no {
  display: flex;
  gap: 12px;
  align-items: center;
  font: 400 11px/1 var(--f-px);
  letter-spacing: 0.12em;
  color: var(--dim);
}
.no em {
  font-style: normal;
  padding: 4px 7px;
  font-size: 10px;
  color: var(--base);
  background: var(--mustard);
}
.no em.wip {
  background: var(--warm);
  animation: cblink 1.6s steps(1, end) infinite;
}
.ep b {
  font-family: var(--f-wide);
  font-weight: 400;
  font-variation-settings:
    'wght' 300,
    'wdth' 150;
  font-size: clamp(70px, 12vw, 180px);
  line-height: 0.9;
  letter-spacing: 0.04em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(92, 201, 190, 0.5);
  transition:
    color 0.6s var(--ease),
    -webkit-text-stroke-color 0.6s,
    text-shadow 0.6s;
}
.ep.on b {
  color: var(--ink);
  -webkit-text-stroke-color: transparent;
  text-shadow:
    0 0 6px rgba(92, 201, 190, 0.55),
    0 0 18px rgba(92, 201, 190, 0.25);
}
.ep h3 {
  margin: 0;
  font: 500 clamp(16px, 1.6vw, 20px)/1.4 var(--f-sans);
  letter-spacing: 0.04em;
  color: var(--dim);
  transition: color 0.5s;
}
.ep.on h3 {
  color: var(--ink);
}
.eps-bar {
  width: calc(100% - 32px);
  max-width: 1168px;
  margin: 0 auto 32px;
  height: 2px;
  background: rgba(238, 231, 218, 0.1);
}
.eps-bar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--aqua), var(--warm));
  transform-origin: left;
  transform: scaleX(0);
}
@keyframes cblink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.12;
  }
}
@media (max-width: 640px) {
  .eps-head {
    padding-left: var(--gut-l);
  }
  .ep {
    width: 78vw;
  }
}
</style>
