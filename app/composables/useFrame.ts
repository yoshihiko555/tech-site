export interface FrameState {
  now: number
  /** ms since the last frame, capped at 50 */
  dt: number
  /** window.scrollY */
  y: number
  /** smoothed scroll speed in px per frame (negative while scrolling up) */
  vel: number
  /** window.innerHeight */
  vh: number
}

type FrameCallback = (state: FrameState) => void

const callbacks = new Set<FrameCallback>()
let raf = 0
let last = 0
let lastY = 0
let vel = 0

function loop(now: number) {
  const dt = Math.min(50, now - last)
  last = now
  const y = window.scrollY
  vel += (y - lastY - vel) * 0.2
  lastY = y
  const state: FrameState = { now, dt, y, vel, vh: window.innerHeight }
  callbacks.forEach((callback) => callback(state))
  raf = callbacks.size ? requestAnimationFrame(loop) : 0
}

/** Calls `callback` on every animation frame while the component is mounted (one shared loop). */
export function useFrame(callback: FrameCallback) {
  onMounted(() => {
    callbacks.add(callback)
    if (raf) return
    last = performance.now()
    lastY = window.scrollY
    vel = 0
    raf = requestAnimationFrame(loop)
  })
  onBeforeUnmount(() => {
    callbacks.delete(callback)
  })
}
