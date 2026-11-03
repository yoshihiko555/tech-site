<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { WORKS } from '~/data/works'

/**
 * Intro movie on a full load of the top page: boot log, the logo assembling, then an
 * ENTER gate; entering splits the screen along a diagonal seam. Rendered on the server
 * as a plain cover so nothing flashes before it starts. Skipped after an in-site
 * navigation, on a #section link and with reduced motion (an inline script hides the
 * cover before first paint in those cases; see pages/index.vue).
 */
const props = defineProps<{ latestCount: number }>()

const LOG = [
  '> yoshihiko.tech // boot sequence',
  '> mount /rain_city ............. ok',
  '> trace circuits ............... ok',
  `> load writing [${padNumber(props.latestCount, 2)}] ............ ok`,
  `> load works [${padNumber(WORKS.length, 2)}] .............. ok`,
  '> calibrate cursor ............. ok',
  '> ready',
]

const nuxtApp = useNuxtApp()
const sound = useSound()
const heroIntro = useState<'none' | 'hold' | 'play'>('hero-intro', () => 'none')
const active = ref(import.meta.server || nuxtApp.isHydrating)
const stages = ref<string[]>([])
const log = ref('')
const count = ref('000')
const bar = ref<HTMLElement | null>(null)
const noise = ref<HTMLCanvasElement | null>(null)
const enterButton = ref<ComponentPublicInstance | null>(null)

const timers: ReturnType<typeof setTimeout>[] = []
const later = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms))
let noiseRaf = 0
const has = (stage: string) => stages.value.includes(stage)
const add = (...names: string[]) => (stages.value = [...new Set([...stages.value, ...names])])

function drawNoise() {
  const ctx = noise.value?.getContext('2d')
  if (!active.value || !ctx) return
  const image = ctx.createImageData(160, 90)
  for (let i = 0; i < image.data.length; i += 4) {
    const v = Math.floor(Math.random() * 180)
    image.data[i] = v
    image.data[i + 1] = v
    image.data[i + 2] = v
    image.data[i + 3] = 255
  }
  ctx.putImageData(image, 0, 0)
  noiseRaf = requestAnimationFrame(drawNoise)
}

function setProgress(value: number) {
  count.value = padNumber(value * 100, 3)
  if (bar.value) bar.value.style.transform = `scaleX(${value.toFixed(3)})`
}

function showGate() {
  timers.forEach(clearTimeout)
  setProgress(1)
  add('s1', 's2', 's3', 's4', 'gate')
  later(() => (enterButton.value?.$el as HTMLElement | undefined)?.focus({ preventScroll: true }), 400)
}

function start() {
  citySignals.covered = true
  heroIntro.value = 'hold'
  document.documentElement.classList.add('loading')
  nuxtApp.$lenis?.stop()
  nuxtApp.$lenis?.scrollTo(0, { immediate: true, force: true })
  window.scrollTo(0, 0)
  requestAnimationFrame(() => requestAnimationFrame(() => add('s1')))
  later(() => add('s2'), 500)
  drawNoise()
  LOG.forEach((line, i) => later(() => (log.value += (i ? '\n' : '') + line), 600 + i * 380))
  const from = performance.now() + 600
  const countUp = (now: number) => {
    if (!active.value || has('gate')) return
    const p = clamp((now - from) / 2800, 0, 1)
    setProgress(1 - Math.pow(1 - p, 3))
    if (p < 1) requestAnimationFrame(countUp)
  }
  requestAnimationFrame(countUp)
  later(() => add('s3'), 1700)
  later(() => add('s4'), 3000)
  later(showGate, 3500)
}

function enter(withSound: boolean) {
  if (!active.value || has('s5')) return
  if (withSound) sound.set(true)
  add('s5')
  citySignals.covered = false
  citySignals.ripple = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  heroIntro.value = 'play'
  sound.sweep()
  later(finish, 950)
}

function finish() {
  active.value = false
  cancelAnimationFrame(noiseRaf)
  document.documentElement.classList.remove('loading')
  nuxtApp.$lenis?.start()
}

function onKey(e: KeyboardEvent) {
  if (!active.value) return
  const onSoundButton = (document.activeElement as HTMLElement | null)?.dataset.cursor === 'SOUND ON'
  if (e.key === 'Enter' && has('gate') && !onSoundButton) {
    e.preventDefault()
    enter(false)
  }
  else if (e.key === 'Escape' && !has('gate')) {
    showGate()
  }
}

onMounted(() => {
  if (!active.value) return
  if (location.hash || motionReduced()) {
    active.value = false
    return
  }
  window.addEventListener('keydown', onKey)
  start()
})
onBeforeUnmount(() => {
  timers.forEach(clearTimeout)
  cancelAnimationFrame(noiseRaf)
  window.removeEventListener('keydown', onKey)
  document.documentElement.classList.remove('loading')
  heroIntro.value = 'none'
  if (active.value) {
    citySignals.covered = false
    nuxtApp.$lenis?.start()
  }
})
</script>

<template>
  <div
    v-if="active"
    class="loader"
    :class="stages"
  >
    <div class="ld-sh ld-a" />
    <div class="ld-sh ld-b" />
    <div class="ld-seam" />
    <div class="ld-ui">
      <canvas
        ref="noise"
        class="ld-noise"
        width="160"
        height="90"
      />
      <div class="ld-frame" />
      <div class="ld-crt" />
      <pre
        class="ld-log"
        aria-hidden="true"
      >{{ log }}</pre>
      <p
        class="ld-id"
        aria-hidden="true"
      >
        YOSHIHIKO.TECH
      </p>
      <div class="ld-center">
        <div
          class="ld-mark"
          aria-hidden="true"
        >
          <svg viewBox="0 0 48 48">
            <g transform="translate(2.85 0)">
              <path
                class="yu ld-u"
                d="M5 8H13.77L19 13.23L24.23 8H33L22.3 18.7V28.6L15.7 22V18.7Z"
              />
              <path
                class="yl ld-l"
                d="M15.7 25.5L22.3 32.1V40H18.4L15.7 37.3Z"
              />
              <path
                class="yc ld-c"
                d="M26.3 35.4H35.2L37.3 37.5V40H26.3Z"
              />
            </g>
          </svg>
        </div>
        <div class="ld-gate">
          <p>system ready. press enter</p>
          <div class="row2">
            <BracketButton
              ref="enterButton"
              label="ENTER"
              tone="warm"
              cursor="ENTER"
              @click="enter(false)"
            />
            <BracketButton
              label="ENTER WITH SOUND"
              cursor="SOUND ON"
              @click="enter(true)"
            />
          </div>
        </div>
      </div>
      <p
        class="ld-count"
        aria-hidden="true"
      >
        <span>{{ count }}</span><i>%</i>
      </p>
      <div
        class="ld-bar"
        aria-hidden="true"
      >
        <span ref="bar" />
      </div>
      <button
        class="ld-skip"
        type="button"
        @click="showGate"
      >
        SKIP
      </button>
    </div>
  </div>
</template>

<style scoped>
.loader {
  position: fixed;
  inset: 0;
  z-index: 100;
  overflow: hidden;
}
.ld-sh {
  position: absolute;
  inset: 0;
  background: #081315;
  transition: transform 0.9s cubic-bezier(0.75, 0, 0.2, 1);
}
.ld-a {
  clip-path: polygon(0 0, calc(50% + 50vh + 2px) 0, 0 calc(50% + 50vw + 2px));
}
.ld-b {
  clip-path: polygon(100% calc(50% - 50vw - 2px), 100% 100%, calc(50% - 50vh - 2px) 100%);
}
.s5 .ld-a {
  transform: translate(-62vmax, -62vmax);
}
.s5 .ld-b {
  transform: translate(62vmax, 62vmax);
}
.ld-seam {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 220vmax;
  height: 2px;
  margin: -1px 0 0 -110vmax;
  background: linear-gradient(90deg, transparent, var(--aqua) 30%, #fff 50%, var(--warm) 70%, transparent);
  box-shadow: 0 0 14px var(--aqua);
  transform: rotate(-45deg) scaleX(0);
  opacity: 0;
  z-index: 3;
}
.s5 .ld-seam {
  animation: seam 0.8s ease-out forwards;
}
@keyframes seam {
  0% {
    opacity: 1;
    transform: rotate(-45deg) scaleX(0);
  }
  35% {
    opacity: 1;
    transform: rotate(-45deg) scaleX(1);
  }
  100% {
    opacity: 0;
    transform: rotate(-45deg) scaleX(1);
  }
}
.ld-ui {
  position: absolute;
  inset: 0;
  z-index: 2;
  transition: opacity 0.3s;
}
.s5 .ld-ui {
  opacity: 0;
}
.ld-frame {
  position: absolute;
  inset: 22px;
  box-shadow: inset 0 0 0 1.5px var(--warm);
  opacity: 0;
  transition: opacity 0.6s;
}
.s2 .ld-frame {
  opacity: 0.8;
}
.ld-noise {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
  opacity: 0;
  mix-blend-mode: screen;
  transition: opacity 0.5s;
}
.s2 .ld-noise {
  opacity: 0.05;
}
.ld-crt {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 2px;
  margin-top: -1px;
  background: #e6fffb;
  box-shadow: 0 0 16px var(--aqua);
  transform: scaleX(0);
  transition: transform 0.45s cubic-bezier(0.7, 0, 0.2, 1);
}
.s1 .ld-crt {
  transform: scaleX(1);
}
.s2 .ld-crt {
  animation: crt 0.6s ease-out forwards;
}
@keyframes crt {
  0% {
    transform: scaleX(1) scaleY(1);
    opacity: 1;
  }
  35% {
    transform: scaleX(1) scaleY(200);
    opacity: 0.25;
  }
  100% {
    transform: scaleX(1) scaleY(420);
    opacity: 0;
  }
}
.ld-log {
  position: absolute;
  left: calc(var(--gut-l) + 30px);
  top: calc(40px + env(safe-area-inset-top, 0px));
  margin: 0;
  font: 12px/1.9 var(--f-mono);
  color: var(--aqua);
  white-space: pre;
  opacity: 0;
  transition: opacity 0.3s;
}
.s2 .ld-log {
  opacity: 1;
}
.ld-id {
  position: absolute;
  right: calc(var(--gut-r) + 30px);
  top: calc(40px + env(safe-area-inset-top, 0px));
  margin: 0;
  font: 11px/1.9 var(--f-px);
  letter-spacing: 0.14em;
  color: var(--dim);
  opacity: 0;
  transition: opacity 0.3s;
}
.s2 .ld-id {
  opacity: 1;
}
.ld-center {
  position: absolute;
  left: 50%;
  top: 50%;
  translate: -50% -50%;
  display: grid;
  justify-items: center;
  gap: 28px;
  width: min(90vw, 560px);
}
.ld-mark {
  width: min(30vw, 200px);
}
.ld-mark svg {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}
.ld-mark path {
  opacity: 0;
  transition:
    transform 1.1s var(--ease),
    opacity 0.6s;
}
.ld-u {
  transform: translate(-12px, -12px);
}
.ld-l {
  transform: translate(12px, 12px);
}
.ld-c {
  transform: translate(16px, 0);
}
.s3 .ld-mark path {
  opacity: 0.85;
  transform: none;
}
.s3 .ld-l {
  transition-delay: 0.15s;
}
.s3 .ld-c {
  transition-delay: 0.3s;
}
.s4 .ld-mark svg {
  filter: drop-shadow(0 0 4px rgba(220, 106, 53, 0.7)) drop-shadow(0 0 16px rgba(220, 106, 53, 0.35));
  animation: tube-on 1s linear 1 both;
}
.s4 .ld-mark path {
  opacity: 1;
}
@keyframes tube-on {
  0% {
    opacity: 0.06;
  }
  10% {
    opacity: 1;
  }
  15% {
    opacity: 0.25;
  }
  24% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
.ld-gate {
  display: grid;
  justify-items: center;
  gap: 12px;
  opacity: 0;
  transform: translateY(10px);
  transition:
    opacity 0.6s,
    transform 0.8s var(--ease);
  pointer-events: none;
}
.gate .ld-gate {
  opacity: 1;
  transform: none;
  pointer-events: auto;
}
.ld-gate p {
  margin: 0;
  font: 12px/1 var(--f-mono);
  color: var(--dim);
}
.ld-gate p::after {
  content: '_';
  color: var(--warm);
  animation: cblink 1.1s steps(1, end) infinite;
}
@keyframes cblink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.12;
  }
}
.row2 {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}
.ld-count {
  position: absolute;
  left: calc(var(--gut-l) + 30px);
  bottom: calc(44px + env(safe-area-inset-bottom, 0px));
  margin: 0;
  display: flex;
  align-items: flex-start;
  gap: 0.1em;
  font-family: var(--f-wide);
  font-variation-settings:
    'wght' 300,
    'wdth' 140;
  font-size: clamp(56px, 9vw, 128px);
  line-height: 0.8;
  letter-spacing: 0.06em;
  color: var(--ink);
  opacity: 0;
  transition: opacity 0.3s;
  font-variant-numeric: tabular-nums;
}
.ld-count i {
  font: 400 12px/1 var(--f-px);
  color: var(--aqua);
  font-style: normal;
  margin-top: 0.5em;
}
.s2 .ld-count {
  opacity: 1;
}
.ld-bar {
  position: absolute;
  left: 22px;
  right: 22px;
  bottom: 22px;
  height: 2px;
  background: rgba(255, 255, 255, 0.06);
}
.ld-bar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--aqua), var(--warm));
  transform-origin: left;
  transform: scaleX(0);
}
.ld-skip {
  position: absolute;
  right: calc(var(--gut-r) + 30px);
  bottom: calc(44px + env(safe-area-inset-bottom, 0px));
  padding: 8px 0;
  border: 0;
  background: none;
  color: var(--dim);
  font: 11px/1 var(--f-px);
  letter-spacing: 0.14em;
  cursor: pointer;
}
.ld-skip:hover {
  color: var(--ink);
}
.gate .ld-skip {
  display: none;
}
</style>

<style>
/* the page stays put while the intro plays */
html.loading,
html.loading body {
  overflow: hidden;
}
</style>
