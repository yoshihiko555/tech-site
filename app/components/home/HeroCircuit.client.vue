<script setup lang="ts">
/** Circuit traces that grow across the hero panel one 12px step at a time and fade out. */
interface Trace {
  x: number
  y: number
  dir: number
  length: number
  max: number
  color: string
  tick: number
}

const props = defineProps<{ active: boolean }>()
const canvas = ref<HTMLCanvasElement | null>(null)
const CELL = 12
const DIRS: [number, number][] = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
]
let ctx: CanvasRenderingContext2D | null = null
let traces: Trace[] = []
let width = 0
let height = 0
let reduced = false

function spawn() {
  traces.push({
    x: Math.floor(Math.random() * Math.floor(width / CELL)) * CELL,
    y: Math.floor(Math.random() * Math.floor(height / CELL)) * CELL,
    dir: Math.floor(Math.random() * 4),
    length: 0,
    max: 12 + Math.floor(Math.random() * 40),
    color: Math.random() < 0.72 ? '92,201,190' : '220,106,53',
    tick: 0,
  })
}

function step() {
  if (!ctx) return
  ctx.globalCompositeOperation = 'destination-out'
  ctx.fillStyle = 'rgba(0,0,0,.035)'
  ctx.fillRect(0, 0, width, height)
  ctx.globalCompositeOperation = 'source-over'
  for (let i = traces.length - 1; i >= 0; i--) {
    const trace = traces[i]!
    trace.tick++
    if (trace.tick % 2) continue
    const [dx, dy] = DIRS[trace.dir]!
    const nx = trace.x + dx * CELL
    const ny = trace.y + dy * CELL
    ctx.strokeStyle = `rgba(${trace.color},.55)`
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(trace.x + 0.5, trace.y + 0.5)
    ctx.lineTo(nx + 0.5, ny + 0.5)
    ctx.stroke()
    trace.x = nx
    trace.y = ny
    trace.length++
    if (Math.random() < 0.18) trace.dir = (trace.dir + (Math.random() < 0.5 ? 1 : 3)) % 4
    if (trace.length > trace.max || nx < 0 || ny < 0 || nx > width || ny > height) {
      ctx.fillStyle = `rgba(${trace.color},.85)`
      ctx.fillRect(trace.x - 2, trace.y - 2, 5, 5)
      traces.splice(i, 1)
      spawn()
    }
  }
}

function resize() {
  const el = canvas.value
  if (!el) return
  const box = el.getBoundingClientRect()
  width = el.width = Math.max(2, Math.round(box.width))
  height = el.height = Math.max(2, Math.round(box.height))
  if (reduced) {
    // a still picture of what the animation would have drawn
    for (let n = 0; n < 600; n++) step()
  }
}

useFrame(() => {
  if (!reduced && props.active) step()
})

onMounted(async () => {
  // a .client component draws its template only after it mounts
  await nextTick()
  if (!canvas.value) return
  reduced = motionReduced()
  ctx = canvas.value.getContext('2d')
  traces = []
  const box = canvas.value.getBoundingClientRect()
  width = Math.round(box.width)
  height = Math.round(box.height)
  for (let i = 0; i < 16; i++) spawn()
  resize()
  window.addEventListener('resize', resize)
})
onBeforeUnmount(() => window.removeEventListener('resize', resize))
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
  display: block;
}
</style>
