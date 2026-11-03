<script setup lang="ts">
/** Dithered colour field behind a section, drawn in the browser (see utils/grain). */
const props = defineProps<{ kind: string }>()

const el = ref<HTMLElement | null>(null)
let paintedWidth = 0
let timer: ReturnType<typeof setTimeout> | undefined

function paint() {
  if (!el.value) return
  paintedWidth = window.innerWidth
  paintGrain(el.value, props.kind)
}
function onResize() {
  clearTimeout(timer)
  timer = setTimeout(() => {
    if (Math.abs(window.innerWidth - paintedWidth) >= 40) paint()
  }, 300)
}

watch(() => props.kind, paint)
onMounted(() => {
  paint()
  window.addEventListener('resize', onResize)
})
onBeforeUnmount(() => {
  clearTimeout(timer)
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <div
    ref="el"
    class="gfx"
    aria-hidden="true"
  />
</template>

<style scoped>
.gfx {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  image-rendering: pixelated;
}
</style>
