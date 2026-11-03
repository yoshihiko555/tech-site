<script setup lang="ts">
/**
 * Crosshair cursor: full-screen hairlines with the pointer's coordinates.
 * Over links it shows a label; over article text the lines step aside.
 * Only for mouse pointers, and never when the visitor asks for reduced motion.
 */
const root = ref<HTMLElement | null>(null)
const horizontal = ref<HTMLElement | null>(null)
const vertical = ref<HTMLElement | null>(null)
const box = ref<HTMLElement | null>(null)
const readout = ref<HTMLElement | null>(null)

const HIT = 'a,button,summary,[data-cursor]'
const TEXT = 'p,li,h1,h2,h3,td,th,pre,blockquote'
/** the top page also reads its labels and key-value lists as text */
const TEXT_HOME = `${TEXT},h4,dd,dt,input`
const route = useRoute()
let hit: Element | null = null
let cleanup: (() => void) | null = null

function pad(n: number): string {
  return String(Math.round(n)).padStart(4, '0')
}

function labelFor(el: Element): string {
  const word = el.getAttribute('data-cursor') || (el.tagName === 'BUTTON' || el.tagName === 'SUMMARY' ? 'PRESS' : 'OPEN')
  return `[ ${word} ]`
}

onMounted(async () => {
  // a .client component draws its template only after it mounts
  await nextTick()
  const fine = window.matchMedia('(pointer: fine)').matches
  const reduced = motionReduced()
  if (!fine || reduced || !horizontal.value) return
  const body = document.body

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    body.classList.add('has-ret')
    const { clientX: x, clientY: y } = e
    horizontal.value!.style.transform = `translate3d(0,${y}px,0)`
    vertical.value!.style.transform = `translate3d(${x}px,0,0)`
    box.value!.style.transform = `translate3d(${x}px,${y}px,0)`
    readout.value!.style.transform = `translate3d(${x}px,${y}px,0)`
    if (!hit) readout.value!.textContent = `X ${pad(x)}  Y ${pad(y)}`
  }
  const onLeave = () => body.classList.remove('has-ret')
  const onOver = (e: PointerEvent) => {
    const target = e.target as Element | null
    if (!target?.closest) return
    hit = target.closest(HIT)
    if (hit) readout.value!.textContent = labelFor(hit)
    body.classList.toggle('cur-lab', !!hit)
    body.classList.toggle('cur-read', !hit && !!target.closest('.prose'))
    body.classList.toggle('cur-txt', !hit && !!target.closest(route.path === '/' ? TEXT_HOME : TEXT))
  }

  // the top page: the box splits into colours for a moment on each press
  const onDown = () => {
    if (route.path === '/') replayClass(body, 'cur-zap', 220)
  }

  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerdown', onDown, { passive: true })
  document.documentElement.addEventListener('mouseleave', onLeave)
  document.addEventListener('pointerover', onOver)
  cleanup = () => {
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerdown', onDown)
    document.documentElement.removeEventListener('mouseleave', onLeave)
    document.removeEventListener('pointerover', onOver)
    body.classList.remove('has-ret', 'cur-lab', 'cur-read', 'cur-txt')
  }
})

// a page change can remove the hovered link without a pointerover
const router = useRouter()
router.afterEach(() => {
  hit = null
  document.body.classList.remove('cur-lab')
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <div
    ref="root"
    class="cur-xh"
    aria-hidden="true"
  >
    <i
      ref="horizontal"
      class="xh-h"
    /><i
      ref="vertical"
      class="xh-v"
    /><i
      ref="box"
      class="xh-box"
    /><span
      ref="readout"
      class="xh-r"
    />
  </div>
</template>

<style scoped>
.cur-xh {
  position: fixed;
  inset: 0;
  z-index: 130;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  --xc: rgba(238, 231, 218, 0.4);
  --xe: rgba(13, 28, 31, 0.3);
}
body.has-ret .cur-xh {
  opacity: 1;
  visibility: visible;
}
body.has-ret.cur-off .cur-xh {
  opacity: 0;
}
.cur-lab .cur-xh {
  --xc: rgba(220, 106, 53, 0.7);
}
.xh-h,
.xh-v,
.xh-box,
.xh-r {
  position: absolute;
  left: 0;
  top: 0;
}
.xh-h,
.xh-v {
  transition: opacity 0.25s;
}
.cur-read .xh-h,
.cur-read .xh-v,
.cur-read .xh-r {
  opacity: 0;
}
.xh-h {
  width: 100vw;
  height: 1px;
  background: var(--xc);
  box-shadow: 0 1px 0 var(--xe);
}
.xh-v {
  width: 1px;
  height: 100vh;
  background: var(--xc);
  box-shadow: 1px 0 0 var(--xe);
}
.xh-box::before {
  content: "";
  position: absolute;
  left: -6px;
  top: -6px;
  width: 12px;
  height: 12px;
  box-shadow: inset 0 0 0 1.5px var(--ink);
  transition:
    width 0.3s var(--ease),
    height 0.3s var(--ease),
    left 0.3s var(--ease),
    top 0.3s var(--ease),
    background 0.2s;
}
.cur-zap .xh-box {
  filter: drop-shadow(-3px 0 rgba(92, 201, 190, 0.95)) drop-shadow(3px 0 rgba(220, 106, 53, 0.95));
}
.cur-lab .xh-box::before {
  left: -13px;
  top: -13px;
  width: 26px;
  height: 26px;
  box-shadow: inset 0 0 0 2px var(--warm);
}
.cur-txt .xh-box::before {
  left: -1px;
  top: -12px;
  width: 2px;
  height: 24px;
  background: var(--ink);
}
.xh-r {
  margin: 14px 0 0 14px;
  padding: 4px 6px;
  font: 400 10px/1 var(--f-px);
  letter-spacing: 0.12em;
  color: var(--aqua);
  background: rgba(13, 28, 31, 0.7);
  white-space: pre;
}
.cur-lab .xh-r {
  margin: 20px 0 0 20px;
  background: var(--warm);
  color: var(--base);
}
</style>

<style>
/* the system pointer hides only while the crosshair is drawn */
body.has-ret,
body.has-ret a,
body.has-ret button,
body.has-ret summary {
  cursor: none;
}
</style>
