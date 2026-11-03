<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { PHRASES, PROFILE, SINCE } from '~/data/profile'

/**
 * The framed hero: logo, the name (letters widen near the pointer), tags, a status line
 * that scrambles between real facts, two buttons and the pointer coordinates.
 * Plays its entrance when the intro opens (`hero-intro`).
 */
const props = defineProps<{ lastPost: string }>()

const section = ref<HTMLElement | null>(null)
const inner = ref<HTMLElement | null>(null)
const nameEl = ref<HTMLElement | null>(null)
const mark = ref<ComponentPublicInstance | null>(null)
const visible = useInView(section, '0px')
/** set by the intro: hold the parts hidden under the cover, then play them in */
const intro = useState<'none' | 'hold' | 'play'>('hero-intro', () => 'none')

const letters = ref(Array.from(PROFILE.name))
const phraseIndex = ref(0)
const phrase = useScrambleText(() => PHRASES[phraseIndex.value]!, { steps: 24 })
const coords = reactive({ x: '0000', y: '0000' })
const clock = ref('00:00')

/** how many hero parts are visible while the entrance plays (null when it is not playing) */
const step = ref<number | null>(null)
const PART_COUNT = 5
const partClass = (i: number) => (step.value === null || i < step.value ? 'in' : '')

let reduced = false
let pointerX = -1
let pointer = { x: 0.5, y: 0.5, k: 0 }
const widths = Array.from(PROFILE.name, () => ({ w: 500, d: 140 }))
const timers: ReturnType<typeof setTimeout>[] = []
const later = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms))

function scrambleLetters() {
  Array.from(PROFILE.name).forEach((final, i) => {
    let n = 0
    const max = 10 + i * 3
    const tick = () => {
      n++
      letters.value[i] = n < max ? randomGlyph() : final
      if (n < max) requestAnimationFrame(tick)
    }
    tick()
  })
}

function playEntrance() {
  if (reduced) return
  timers.forEach(clearTimeout)
  step.value = 0
  for (let i = 0; i < PART_COUNT; i++) {
    later(() => {
      step.value = i + 1
      if (i === 1) scrambleLetters()
      if (i === 3) phraseIndex.value = 0
    }, 150 + i * 140)
  }
  later(() => (step.value = null), 150 + PART_COUNT * 140 + 900)
}
watch(intro, (state) => {
  if (state === 'hold' && !reduced) step.value = 0
  if (state === 'play') playEntrance()
})

useFrame(({ y }) => {
  if (reduced || !visible.value || !inner.value) return
  const lx = pointer.x - 0.5
  const ly = pointer.y - 0.5
  inner.value.style.transform = `translate3d(${(-lx * 10 * pointer.k).toFixed(1)}px,${(ly * 6 * pointer.k + y * 0.12).toFixed(1)}px,0)`
  if (step.value !== null || !nameEl.value) return
  const spans = [...nameEl.value.querySelectorAll<HTMLElement>('.ch')]
  const centers = spans.map((s) => {
    const b = s.getBoundingClientRect()
    return b.left + b.width / 2
  })
  spans.forEach((s, i) => {
    const near = pointerX >= 0 ? Math.max(0, 1 - Math.abs(pointerX - centers[i]!) / 160) : 0
    const c = widths[i]!
    c.d += (140 - near * 40 - c.d) * 0.12
    c.w += (500 + near * 300 - c.w) * 0.12
    s.style.fontVariationSettings = `"wght" ${c.w.toFixed(0)}, "wdth" ${c.d.toFixed(1)}`
  })
})

function onMove(e: PointerEvent) {
  pointer = { x: e.clientX / window.innerWidth, y: 1 - e.clientY / window.innerHeight, k: 1 }
  pointerX = e.clientX
  coords.x = padNumber(e.clientX, 4)
  coords.y = padNumber(e.clientY, 4)
}
function onLeave() {
  pointer.k = 0
  pointerX = -1
}
function tickClock() {
  const d = new Date()
  clock.value = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
function glitchMark() {
  replayClass(mark.value?.$el as Element | undefined, 'mg', 340)
}
function scheduleGlitch() {
  later(
    () => {
      if (visible.value && step.value === null && !citySignals.covered && !document.hidden) glitchMark()
      scheduleGlitch()
    },
    9000 + Math.random() * 5000,
  )
}

let phraseTimer: ReturnType<typeof setInterval> | undefined
let clockTimer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  reduced = prefersReducedMotion()
  tickClock()
  clockTimer = setInterval(tickClock, 15000)
  window.addEventListener('pointermove', onMove, { passive: true })
  document.documentElement.addEventListener('mouseleave', onLeave)
  if (reduced) return
  phraseTimer = setInterval(() => {
    if (citySignals.covered || !visible.value) return
    phraseIndex.value = (phraseIndex.value + 1) % PHRASES.length
  }, 4200)
  scheduleGlitch()
})
onBeforeUnmount(() => {
  timers.forEach(clearTimeout)
  clearInterval(phraseTimer)
  clearInterval(clockTimer)
  window.removeEventListener('pointermove', onMove)
  document.documentElement.removeEventListener('mouseleave', onLeave)
})
</script>

<template>
  <section
    id="hero"
    ref="section"
    class="hero"
    data-tag="<home/>"
  >
    <div class="hpanel">
      <HeroCircuit :active="visible" />
      <div
        ref="inner"
        class="hero-in"
        :class="{ entering: step !== null }"
      >
        <LogoMark
          ref="mark"
          class="hmark"
          :class="partClass(0)"
          @pointerenter="glitchMark"
        />
        <h1
          ref="nameEl"
          class="name"
          :class="partClass(1)"
          data-cursor="HELLO"
          tabindex="0"
        >
          <span class="sr-only">{{ PROFILE.name }}</span><span
            v-for="(ch, i) in letters"
            :key="i"
            class="ch"
            aria-hidden="true"
          >{{ ch }}</span>
        </h1>
        <p
          class="tags"
          :class="partClass(2)"
        >
          <span>&lt; {{ PROFILE.role }} /&gt;</span><span><b>SINCE</b> {{ SINCE }}</span><span><b>STACK</b> {{ PROFILE.stackLine }}</span>
        </p>
        <p
          class="scr"
          :class="partClass(3)"
        >
          {{ phrase }}
        </p>
        <div
          class="hcta"
          :class="partClass(4)"
        >
          <BracketButton
            label="READ ARTICLES"
            to="/#posts"
            tone="warm"
            magnetic
          />
          <BracketButton
            label="VIEW STATUS"
            to="/#status"
            magnetic
          />
        </div>
      </div>
      <p
        class="hcorner hc-l"
        aria-hidden="true"
      >
        <span><b>X</b> {{ coords.x }}</span><span><b>Y</b> {{ coords.y }}</span>
      </p>
      <p
        class="hcorner hc-r"
        aria-hidden="true"
      >
        <span><b>LAST POST</b> {{ props.lastPost }}</span><span><b>LOCAL</b> {{ clock }}</span>
      </p>
      <p
        class="scroll-cue"
        aria-hidden="true"
      >
        SCROLL<i />
      </p>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  height: clamp(600px, calc(100vh - var(--head)), 960px);
  padding: 18px max(18px, var(--gut-r)) 18px max(18px, var(--gut-l));
}
.hpanel {
  position: relative;
  height: 100%;
  overflow: hidden;
  background: rgba(10, 24, 27, 0.55);
  box-shadow: inset 0 0 0 1.5px var(--warm);
  clip-path: polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 22px 100%, 0 calc(100% - 22px));
  animation: flick 8s steps(1) infinite;
}
.hpanel::before,
.hpanel::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 6px;
  height: 120px;
  margin-top: -60px;
  background: var(--warm);
  z-index: 2;
}
.hpanel::before {
  left: 0;
}
.hpanel::after {
  right: 0;
}
/* neon tube flicker on the frame */
@keyframes flick {
  0%,
  100% {
    box-shadow: inset 0 0 0 1.5px var(--warm);
  }
  91% {
    box-shadow: inset 0 0 0 1.5px rgba(220, 106, 53, 0.25);
  }
  92% {
    box-shadow:
      inset 0 0 0 1.5px var(--warm),
      inset 0 0 26px rgba(220, 106, 53, 0.35);
  }
  94% {
    box-shadow: inset 0 0 0 1.5px rgba(220, 106, 53, 0.4);
  }
  95% {
    box-shadow:
      inset 0 0 0 1.5px var(--warm),
      inset 0 0 18px rgba(220, 106, 53, 0.25);
  }
}
.hero-in {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 20px;
  padding: 40px 24px;
  text-align: center;
  will-change: transform;
}
.hero-in > * {
  transition:
    opacity 0.9s var(--ease),
    transform 1.1s var(--ease);
}
.hero-in.entering > *:not(.in) {
  opacity: 0;
  transform: translateY(18px);
}
.hmark {
  width: clamp(56px, 6vw, 84px);
  height: auto;
  overflow: visible;
  filter: drop-shadow(0 0 4px rgba(220, 106, 53, 0.55)) drop-shadow(0 0 14px rgba(220, 106, 53, 0.25));
}
.hmark.mg {
  animation: mg 0.32s steps(3) 1;
}
@keyframes mg {
  0% {
    transform: translate(-4px, 0);
    filter: drop-shadow(-4px 0 rgba(92, 201, 190, 0.9)) drop-shadow(4px 0 rgba(220, 106, 53, 0.9));
  }
  50% {
    transform: translate(3px, 1px);
  }
  100% {
    transform: none;
  }
}
.name {
  margin: 0;
  font-family: var(--f-wide);
  font-weight: 400;
  font-variation-settings:
    'wght' 500,
    'wdth' 140;
  font-size: clamp(34px, 6.6vw, 108px);
  line-height: 1;
  letter-spacing: 0.16em;
  padding-left: 0.16em;
  color: var(--ink);
  text-shadow:
    0 0 8px rgba(238, 231, 218, 0.35),
    0 0 24px rgba(92, 201, 190, 0.18);
  white-space: nowrap;
  outline: none;
}
.ch {
  display: inline-block;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px 22px;
  margin: 0;
  font: 400 12px/1 var(--f-px);
  letter-spacing: 0.12em;
  color: var(--dim);
}
.tags b {
  font-weight: 400;
  color: var(--ink);
}
.scr {
  margin: 0;
  min-height: 1.5em;
  font: 500 clamp(14px, 1.4vw, 18px)/1.5 var(--f-mono);
  letter-spacing: 0.06em;
  color: var(--aqua);
  text-shadow:
    0 0 6px rgba(92, 201, 190, 0.55),
    0 0 18px rgba(92, 201, 190, 0.25);
}
.scr::after {
  content: '_';
  color: var(--warm);
  animation: cblink 1.1s steps(1, end) infinite;
}
.hcta {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 6px;
}
.hcorner {
  position: absolute;
  bottom: 20px;
  margin: 0;
  font: 400 10px/1 var(--f-px);
  letter-spacing: 0.14em;
  color: var(--dim);
  font-variant-numeric: tabular-nums;
  display: flex;
  gap: 16px;
}
.hcorner b {
  font-weight: 400;
  color: var(--aqua);
}
.hc-l {
  left: 30px;
}
.hc-r {
  right: 30px;
}
.scroll-cue {
  position: absolute;
  left: 50%;
  bottom: 18px;
  translate: -50% 0;
  margin: 0;
  font: 400 10px/1 var(--f-px);
  letter-spacing: 0.2em;
  color: var(--dim);
  display: grid;
  justify-items: center;
  gap: 6px;
}
.scroll-cue i {
  display: block;
  width: 12px;
  height: 12px;
  border-right: 1.5px solid var(--warm);
  border-bottom: 1.5px solid var(--warm);
  transform: rotate(45deg);
  animation: cue 1.8s ease-in-out infinite;
}
@keyframes cue {
  0%,
  100% {
    transform: translateY(-2px) rotate(45deg);
    opacity: 0.4;
  }
  50% {
    transform: translateY(3px) rotate(45deg);
    opacity: 1;
  }
}
@keyframes cblink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.12;
  }
}
@media (max-width: 640px) {
  .hero {
    padding: 12px;
  }
  .hcorner {
    display: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .hpanel,
  .scr::after,
  .scroll-cue i {
    animation: none;
  }
  .hero-in > * {
    transition: none;
  }
}
</style>
