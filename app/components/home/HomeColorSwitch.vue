<script setup lang="ts">
/**
 * Pinned scene between STATUS and WRITING: the warm screen is repainted teal in
 * 18px pixels as you scroll, behind a word that stretches open.
 */
const props = defineProps<{ postCount: number }>()

const BLOCK = 18
const scene = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const word = ref<HTMLElement | null>(null)
const hud = ref<HTMLElement | null>(null)
const percent = ref('000%')
const inView = useInView(scene)

let cols = 0
let rows = 0
let thresholds: number[] = []
let last = ''

function resize() {
  const el = canvas.value
  if (!el) return
  cols = Math.ceil(el.clientWidth / BLOCK)
  rows = Math.ceil(el.clientHeight / BLOCK)
  el.width = cols
  el.height = rows
  thresholds = []
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) thresholds.push(0.6 * Math.random() + 0.4 * (1 - j / rows))
  }
  last = ''
}

useFrame(({ vh }) => {
  const el = scene.value
  const ctx = canvas.value?.getContext('2d')
  if (!inView.value || !el || !ctx) return
  const p = clamp(-el.getBoundingClientRect().top / Math.max(1, el.offsetHeight - vh), 0, 1)
  const q = clamp((p - 0.12) / 0.7, 0, 1)
  const key = q.toFixed(3)
  if (key === last) return
  last = key
  ctx.clearRect(0, 0, cols, rows)
  ctx.fillStyle = '#173A3D'
  thresholds.forEach((threshold, n) => {
    if (threshold < q) ctx.fillRect(n % cols, Math.floor(n / cols), 1, 1)
  })
  const open = motionReduced() ? 1 : p
  if (word.value) {
    word.value.style.fontVariationSettings = `"wght" 820, "wdth" ${(50 + open * 100).toFixed(1)}`
    word.value.style.letterSpacing = `${(open * 0.12).toFixed(3)}em`
  }
  const mix = clamp((q - 0.4) / 0.25, 0, 1)
  hud.value?.style.setProperty('--xf-c', mix > 0.5 ? '#EEE7DA' : '#18120F')
  percent.value = `${padNumber(q * 100, 3)}%`
})

onMounted(async () => {
  await nextTick()
  resize()
  window.addEventListener('resize', resize)
})
onBeforeUnmount(() => window.removeEventListener('resize', resize))
</script>

<template>
  <div
    ref="scene"
    class="xfade"
    aria-hidden="true"
  >
    <div class="xf-stage">
      <canvas
        ref="canvas"
        class="xf-cv"
      />
      <p
        ref="word"
        class="xf-word"
      >
        <span>{{ props.postCount }} POSTS</span>
      </p>
      <div
        ref="hud"
        class="xf-hud"
      >
        <span>&lt;status/&gt;</span><span>{{ percent }}</span><span>&lt;writing/&gt;</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.xfade {
  position: relative;
  height: 190vh;
}
.xf-stage {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  display: grid;
  place-items: center;
  background: var(--warm);
}
.xf-cv {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
}
.xf-word {
  position: relative;
  margin: 0;
  display: grid;
  font-family: var(--f-wide);
  font-size: clamp(56px, 14vw, 250px);
  line-height: 0.9;
  white-space: nowrap;
  font-variation-settings:
    'wght' 820,
    'wdth' 50;
}
.xf-word span {
  grid-area: 1 / 1;
  text-align: center;
  color: var(--ink);
  mix-blend-mode: difference;
}
.xf-hud {
  position: absolute;
  left: max(var(--gut-l), 48px);
  right: var(--gut-r);
  bottom: 34px;
  display: flex;
  justify-content: space-between;
  font: 400 11px/1 var(--f-px);
  letter-spacing: 0.14em;
  color: var(--xf-c, #18120f);
}
</style>
