<script setup lang="ts">
/** One row of giant type, words joined by slashes; letters flicker while on screen. */
const props = defineProps<{
  words: string[]
  /** outlined letters instead of filled ones */
  outline?: boolean
}>()

const row = ref<HTMLElement | null>(null)
const inView = useInView(row)
const parts = computed(() =>
  props.words.map((word) => Array.from(word, (ch) => (ch === ' ' ? ' ' : ch))),
)

watch(inView, (on) => {
  if (row.value) setRowFlicker(row.value, on)
})
onBeforeUnmount(() => {
  if (row.value) setRowFlicker(row.value, false)
})
defineExpose({ row })
</script>

<template>
  <div
    ref="row"
    class="g-row"
    :class="{ out: outline }"
  >
    <template
      v-for="(chars, w) in parts"
      :key="w"
    >
      <i
        v-if="w"
        class="sl"
      >/</i><span
        v-for="(ch, i) in chars"
        :key="i"
        class="c"
      >{{ ch }}</span>
    </template>
  </div>
</template>

<style scoped>
.g-row {
  display: flex;
  width: max-content;
  white-space: nowrap;
  font-family: var(--f-wide);
  font-variation-settings:
    'wght' 820,
    'wdth' 112;
  font-size: var(--g-size, clamp(64px, 13vw, 220px));
  line-height: 0.95;
  letter-spacing: -0.01em;
  will-change: transform;
}
.g-row.out {
  color: transparent;
  -webkit-text-stroke: 1.5px var(--g-stroke, rgba(238, 231, 218, 0.5));
  font-variation-settings:
    'wght' 300,
    'wdth' 150;
}
.c {
  display: inline-block;
}
.sl {
  font-style: normal;
  color: var(--warm);
  -webkit-text-stroke: 0;
  padding: 0 0.18em;
  font-variation-settings:
    'wght' 300,
    'wdth' 50;
}
.c.gl {
  color: var(--aqua);
  -webkit-text-stroke: 0;
}
</style>
