<script setup lang="ts">
import { GIANT_ROWS } from '~/data/profile'

/** Giant words that bleed past both edges and slide in opposite directions with the scroll. */
const block = ref<HTMLElement | null>(null)
const rows = ref<{ row: HTMLElement | null }[]>([])
const inView = useInView(block)

useFrame(({ vel, vh }) => {
  if (!inView.value || !block.value) return
  const skew = prefersReducedMotion() ? 0 : clamp(vel * 0.12, -10, 10)
  const top = block.value.getBoundingClientRect().top
  const p = clamp((vh - top) / (vh + block.value.offsetHeight), 0, 1)
  rows.value.forEach((item, i) => {
    const el = item?.row
    if (!el) return
    const leftward = i % 2 === 0
    const x = leftward ? -p * 38 : -32 + p * 38
    el.style.transform = `translate3d(${x.toFixed(2)}vw,0,0) skewX(${(-skew).toFixed(2)}deg)`
    if (leftward) el.style.fontVariationSettings = `"wght" 820, "wdth" ${(70 + p * 80).toFixed(1)}`
  })
})
</script>

<template>
  <div
    ref="block"
    class="giant"
    aria-hidden="true"
  >
    <GiantRow
      v-for="(words, i) in GIANT_ROWS"
      :key="i"
      ref="rows"
      :words="words"
      :outline="i % 2 === 1"
    />
  </div>
</template>

<style scoped>
.giant {
  position: relative;
  padding: clamp(40px, 7vw, 110px) 0 170px;
  overflow: hidden;
  color: var(--ink);
  user-select: none;
}
.giant > * + * {
  margin-top: 0.06em;
}
</style>
