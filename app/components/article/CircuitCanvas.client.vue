<script setup lang="ts">
/** Quiet circuit traces behind the article title, with a few travelling pulses. */
type Point = [number, number]

const canvas = ref<HTMLCanvasElement | null>(null)
const GRID = 22
let traces: Point[][] = []
let pulses: { trace: Point[], at: number }[] = []
let width = 0
let height = 0
let frame = 0
let visible = true
let observer: IntersectionObserver | null = null

function randomInt(max: number): number {
  return Math.floor(Math.random() * max)
}

function build() {
  const el = canvas.value
  if (!el) return
  const ratio = Math.min(2, window.devicePixelRatio || 1)
  const rect = el.getBoundingClientRect()
  width = rect.width
  height = rect.height
  el.width = width * ratio
  el.height = height * ratio
  el.getContext('2d')!.setTransform(ratio, 0, 0, ratio, 0, 0)
  const cols = Math.ceil(width / GRID)
  const rows = Math.ceil(height / GRID)
  traces = Array.from({ length: Math.round((cols * rows) / 9) }, () => {
    let x = randomInt(cols) * GRID
    let y = randomInt(rows) * GRID
    let horizontal = Math.random() < 0.5
    const points: Point[] = [[x, y]]
    for (let s = 0; s < 3 + randomInt(4); s++) {
      const length = (1 + randomInt(4)) * GRID * (Math.random() < 0.5 ? 1 : -1)
      if (horizontal) x += length
      else y += length
      points.push([x, y])
      horizontal = !horizontal
    }
    return points
  })
  pulses = traces.slice(0, 7).map(trace => ({ trace, at: Math.random() }))
  paint(0)
}

function pointAlong(points: Point[], at: number): Point {
  const lengths = points.slice(1).map((p, i) => Math.abs(p[0] - points[i]![0]) + Math.abs(p[1] - points[i]![1]))
  let want = at * lengths.reduce((a, b) => a + b, 0)
  for (let i = 0; i < lengths.length; i++) {
    const length = lengths[i]!
    if (want <= length) {
      const f = length ? want / length : 0
      const [a, b] = [points[i]!, points[i + 1]!]
      return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]
    }
    want -= length
  }
  return points[points.length - 1]!
}

function paint(dt: number) {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)
  ctx.lineWidth = 1
  ctx.strokeStyle = 'rgba(92,201,190,0.16)'
  ctx.fillStyle = 'rgba(92,201,190,0.3)'
  for (const points of traces) {
    ctx.beginPath()
    points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
    ctx.stroke()
    ctx.fillRect(points[0]![0] - 2, points[0]![1] - 2, 4, 4)
  }
  pulses.forEach((pulse, i) => {
    pulse.at = (pulse.at + dt * (0.00008 + i * 0.00001)) % 1
    const [x, y] = pointAlong(pulse.trace, pulse.at)
    ctx.fillStyle = i % 2 ? 'rgba(220,106,53,0.9)' : 'rgba(238,231,218,0.8)'
    ctx.fillRect(x - 2, y - 2, 4, 4)
  })
}

let resizeTimer: ReturnType<typeof setTimeout> | undefined
function onResize() {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(build, 200)
}

onMounted(async () => {
  // a .client component draws its template only after it mounts
  await nextTick()
  if (!canvas.value) return
  build()
  window.addEventListener('resize', onResize)
  if (motionReduced()) return
  observer = new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting
  })
  observer.observe(canvas.value!)
  let last = performance.now()
  const loop = (now: number) => {
    const dt = Math.min(50, now - last)
    last = now
    if (visible && !document.hidden) paint(dt)
    frame = requestAnimationFrame(loop)
  }
  frame = requestAnimationFrame(loop)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  observer?.disconnect()
  window.removeEventListener('resize', onResize)
  clearTimeout(resizeTimer)
})
</script>

<template>
  <canvas
    ref="canvas"
    class="circuit"
    aria-hidden="true"
  />
</template>

<style scoped>
.circuit {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.55;
}
</style>
