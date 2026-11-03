<script setup lang="ts">
/**
 * Full-screen WebGL background of the top page: a muted rain city that leans with
 * the pointer, ripples on click, bends under hovered article rows, sweeps a scan band
 * when a section changes and shifts with the scroll. Falls back to soft gradients.
 */
const canvas = ref<HTMLCanvasElement | null>(null)
const failed = ref(false)

let city: ReturnType<typeof createCityProgram> = null
let reduced = false
let dirty = true
let seenSweeps = 0
// shader inputs, each easing toward its target
let t = 3
let glitch = 0
let fade = 1
const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, k: 0, tk: 0 }
const hover = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, s: 0, ts: 0 }
let ripple: [number, number, number] = [0.5, 0.5, -99]
let sweepAt = -99
let cam = 0
let dim = 0.7

function toUv(x: number, y: number): [number, number] {
  return [x / window.innerWidth, 1 - y / window.innerHeight]
}

function resize() {
  if (!city || !canvas.value) return
  const scale = (window.innerWidth < 700 ? 0.42 : 0.5) * Math.min(2, window.devicePixelRatio || 1)
  canvas.value.width = Math.max(2, Math.round(window.innerWidth * scale))
  canvas.value.height = Math.max(2, Math.round(window.innerHeight * scale))
  city.gl.viewport(0, 0, canvas.value.width, canvas.value.height)
  dirty = true
}

function draw() {
  if (!city || !canvas.value) return
  const { gl, uniforms: u } = city
  gl.uniform2f(u.r, canvas.value.width, canvas.value.height)
  gl.uniform1f(u.t, t)
  gl.uniform2f(u.m, mouse.x, mouse.y)
  gl.uniform1f(u.g, glitch)
  gl.uniform1f(u.k, mouse.k)
  gl.uniform1f(u.v, fade)
  gl.uniform1f(u.sc, cam)
  gl.uniform1f(u.dim, dim)
  gl.uniform2f(u.hp, hover.x, hover.y)
  gl.uniform1f(u.hs, hover.s)
  gl.uniform3f(u.cw, ...ripple)
  gl.uniform1f(u.sw, sweepAt)
  gl.uniform3f(u.warm, 0.86, 0.42, 0.21)
  gl.drawArrays(gl.TRIANGLES, 0, 3)
}

/** picks up what the page asked for since the last frame */
function readSignals() {
  const signals = citySignals
  if (signals.hover) {
    ;[hover.tx, hover.ty] = toUv(signals.hover.x, signals.hover.y)
    hover.ts = 1
  }
  else {
    hover.ts = 0
  }
  if (signals.ripple && !reduced) ripple = [...toUv(signals.ripple.x, signals.ripple.y), t]
  signals.ripple = null
  if (signals.sweeps !== seenSweeps) {
    seenSweeps = signals.sweeps
    if (!reduced) sweepAt = t
  }
}

useFrame(({ dt, y, vel }) => {
  if (!city || document.hidden) return
  readSignals()
  if (!reduced && Math.abs(vel) > 4) glitch = Math.max(glitch, Math.min(0.25, Math.abs(vel) * 0.006))
  const docH = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
  const camTarget = clamp(y / docH, 0, 1) * 0.3
  if (citySignals.covered) fade = 0
  else if (fade < 1) fade = reduced ? 1 : Math.min(1, fade + dt / 800)
  const moving
    = Math.abs(mouse.tx - mouse.x) + Math.abs(mouse.ty - mouse.y) + Math.abs(mouse.tk - mouse.k) + glitch
      + Math.abs(camTarget - cam) + Math.abs(hover.ts - hover.s) + Math.abs(citySignals.dim - dim) > 0.003
  if (reduced && !moving && !dirty) return
  const ease = (rate: number) => (reduced ? 1 : rate)
  if (!reduced) t += dt / 1000
  mouse.x += (mouse.tx - mouse.x) * ease(0.06)
  mouse.y += (mouse.ty - mouse.y) * ease(0.06)
  mouse.k += (mouse.tk - mouse.k) * ease(0.06)
  cam += (camTarget - cam) * ease(0.08)
  hover.s += (hover.ts - hover.s) * ease(0.1)
  hover.x += (hover.tx - hover.x) * ease(0.2)
  hover.y += (hover.ty - hover.y) * ease(0.2)
  dim += (citySignals.dim - dim) * ease(0.05)
  glitch *= 0.9
  if (glitch < 0.002) glitch = 0
  draw()
  dirty = false
})

function onMove(e: PointerEvent) {
  ;[mouse.tx, mouse.ty] = toUv(e.clientX, e.clientY)
  mouse.tk = 1
}
function onLeave() {
  mouse.tk = 0
}
function onDown(e: PointerEvent) {
  const target = e.target as Element | null
  if (target?.closest?.('input,.loader')) return
  citySignals.ripple = { x: e.clientX, y: e.clientY }
}

onMounted(async () => {
  // a .client component draws its template only after it mounts
  await nextTick()
  if (!canvas.value) return
  reduced = motionReduced()
  city = createCityProgram(canvas.value)
  if (!city) {
    failed.value = true
    return
  }
  resize()
  draw()
  window.addEventListener('resize', resize)
  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerdown', onDown, { passive: true })
  document.documentElement.addEventListener('mouseleave', onLeave)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerdown', onDown)
  document.documentElement.removeEventListener('mouseleave', onLeave)
  citySignals.hover = null
  citySignals.ripple = null
  citySignals.covered = false
  citySignals.dim = 0.7
})
</script>

<template>
  <div
    v-if="failed"
    class="city-fallback"
    aria-hidden="true"
  />
  <canvas
    v-else
    ref="canvas"
    class="city"
    aria-hidden="true"
  />
</template>

<style scoped>
.city,
.city-fallback {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  display: block;
  z-index: -1;
  pointer-events: none;
}
.city-fallback {
  background:
    radial-gradient(40% 60% at 78% 30%, rgba(220, 106, 53, 0.18), transparent 70%),
    radial-gradient(40% 50% at 22% 60%, rgba(92, 201, 190, 0.14), transparent 70%),
    linear-gradient(#0f2427, var(--base));
}
</style>
