<script setup lang="ts">
import { LINKS, PROFILE } from '~/data/profile'

/** Closing frame of the top page: links, and YOSHIHIKO.TECH sized to fill the width. */
const SECTIONS = [
  { label: '<about/>', to: '/#status' },
  { label: '<writing/>', to: '/#posts' },
  { label: '<log/>', to: '/#episodes' },
  { label: '<works/>', to: '/#works' },
]
const ELSEWHERE = [
  { label: 'GITHUB', href: LINKS.github },
  { label: 'X', href: LINKS.x },
  { label: 'RSS', href: LINKS.rss },
]
const LINES = ['YOSHIHIKO', '.TECH']

const year = useBuildYear()
const word = ref<HTMLElement | null>(null)
const live = ref(false)
const shown = useReveal(word, () => {
  if (motionReduced()) return
  setTimeout(() => (live.value = true), 1400)
})
const { $lenis } = useNuxtApp()

/** letters of both lines, numbered across the whole word for the stagger */
const lines = LINES.map((line, n) => {
  const offset = LINES.slice(0, n).join('').length
  return Array.from(line, (ch, i) => ({ ch, i: offset + i }))
})

function fit() {
  const el = word.value
  if (!el) return
  el.style.fontSize = '100px'
  const parts = [...el.querySelectorAll<HTMLElement>('.fw-l')]
  const cursor = el.querySelector<HTMLElement>('.fw-cur')
  if (parts.length < 2 || !cursor) return
  const stacked = parts[1]!.offsetTop > parts[0]!.offsetTop
  const widths = parts.map((part) => {
    const chars = part.querySelectorAll('.c')
    return chars[chars.length - 1]!.getBoundingClientRect().right - chars[0]!.getBoundingClientRect().left
  })
  const cursorWidth = cursor.getBoundingClientRect().width + 6
  const need = stacked ? Math.max(widths[0]!, widths[1]! + cursorWidth) : widths[0]! + widths[1]! + cursorWidth
  if (need > 0) el.style.fontSize = `${((100 * el.clientWidth) / need) * 0.985}px`
}

function onPointer(e: PointerEvent) {
  if (!live.value || !word.value) return
  for (const c of word.value.querySelectorAll<HTMLElement>('.c')) {
    const r = c.getBoundingClientRect()
    const dx = Math.abs(r.left + r.width / 2 - e.clientX) / (r.width * 2.2)
    const dy = Math.abs(r.top + r.height / 2 - e.clientY) / (r.height * 2.4)
    const p = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy))
    c.style.setProperty('--p', (p * p).toFixed(3))
  }
}
function onPointerLeave() {
  word.value?.querySelectorAll<HTMLElement>('.c').forEach((c) => c.style.setProperty('--p', '0'))
}

function backToTop() {
  if ($lenis) $lenis.scrollTo(0)
  else window.scrollTo({ top: 0, behavior: motionReduced() ? 'auto' : 'smooth' })
}

let raf = 0
function onResize() {
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(fit)
}
onMounted(() => {
  fit()
  document.fonts?.ready.then(fit)
  window.addEventListener('resize', onResize)
})
onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <footer
    class="foot"
    @pointermove="onPointer"
    @pointerleave="onPointerLeave"
  >
    <div class="fpanel">
      <div class="fp-top">
        <div class="fp-id">
          <LogoMark class="fmark" />
          <p class="fp-lede">
            {{ PROFILE.lede }}
          </p>
        </div>
        <nav
          class="fp-col"
          aria-label="Sections"
        >
          <h3>[ SITE ]</h3>
          <NuxtLink
            v-for="item in SECTIONS"
            :key="item.to"
            class="hov"
            :to="item.to"
          >
            <RollText :text="item.label" />
          </NuxtLink>
        </nav>
        <nav
          class="fp-col"
          aria-label="Elsewhere"
        >
          <h3>[ ELSEWHERE ]</h3>
          <a
            v-for="item in ELSEWHERE"
            :key="item.label"
            class="hov"
            :href="item.href"
            target="_blank"
            rel="noopener"
            data-cursor="OPEN"
          ><RollText :text="item.label" /><span
            class="ext"
            aria-hidden="true"
          >↗</span></a>
        </nav>
        <BracketButton
          class="fp-btn"
          label="BACK TO TOP"
          magnetic
          @click="backToTop"
        />
      </div>
      <div
        ref="word"
        class="fword"
        :class="{ pre: !shown, live }"
        aria-hidden="true"
      >
        <span
          v-for="(line, n) in lines"
          :key="n"
          class="fw-l"
        ><span
          v-for="letter in line"
          :key="letter.i"
          class="c"
          :style="{ '--i': letter.i }"
        >{{ letter.ch }}</span></span><i class="fw-cur" />
      </div>
    </div>
    <div class="fbar">
      <p>© {{ year }} YOSHIHIKO</p>
      <p>BUILT WITH NUXT / CONTENTFUL / VERCEL</p>
    </div>
  </footer>
</template>

<style scoped>
.foot {
  position: relative;
  margin-top: 120px;
  padding: 18px max(18px, var(--gut-r)) 0 max(18px, var(--gut-l));
  background: var(--base);
}
.fpanel {
  position: relative;
  padding: clamp(36px, 5vw, 64px) clamp(24px, 4vw, 56px) clamp(18px, 2.4vw, 30px);
  background: rgba(10, 24, 27, 0.55);
  box-shadow: inset 0 0 0 1.5px var(--warm);
  clip-path: polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 22px 100%, 0 calc(100% - 22px));
}
.fpanel::before,
.fpanel::after {
  content: '';
  position: absolute;
  top: 40px;
  width: 6px;
  height: 72px;
  background: var(--warm);
}
.fpanel::before {
  left: 0;
}
.fpanel::after {
  right: 0;
}
.fp-top {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) repeat(2, minmax(0, 0.7fr)) auto;
  gap: 32px 40px;
  align-items: start;
}
.fp-id {
  display: grid;
  gap: 18px;
  justify-items: start;
}
.fmark {
  width: 52px;
  height: 52px;
  overflow: visible;
  filter: drop-shadow(0 0 4px rgba(220, 106, 53, 0.45));
}
.fp-lede {
  margin: 0;
  max-width: 30ch;
  font: 400 15px/1.7 var(--f-sans);
  color: var(--dim);
}
.fp-col {
  display: grid;
  gap: 2px;
  justify-items: start;
}
.fp-col h3 {
  margin: 0 0 10px;
  font: 400 10px/1 var(--f-px);
  letter-spacing: 0.16em;
  color: var(--warm);
}
.fp-col a {
  padding: 5px 0;
  font: 400 12px/1 var(--f-px);
  letter-spacing: 0.1em;
  color: var(--ink);
  text-decoration: none;
}
.fp-col a:hover {
  color: var(--aqua);
}
.ext {
  margin-left: 6px;
  color: var(--dim);
}
.fword {
  position: relative;
  margin-top: clamp(48px, 7vw, 96px);
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-end;
  font-family: var(--f-wide);
  font-variation-settings:
    'wght' 400,
    'wdth' 150;
  font-size: 7vw;
  line-height: 0.92;
  letter-spacing: 0.06em;
  white-space: nowrap;
  color: var(--ink);
  user-select: none;
}
.fw-l {
  display: inline-flex;
  flex: none;
  overflow: hidden;
  padding-top: 0.16em;
}
.fword .c {
  display: inline-block;
  color: color-mix(in oklab, var(--warm) calc(var(--p, 0) * 100%), var(--ink));
  transform: translateY(calc(var(--p, 0) * -14%));
  transition:
    transform 0.9s var(--ease),
    color 0.35s;
  transition-delay: calc(var(--i) * 40ms), 0s;
}
.fword.pre .c {
  transform: translateY(105%);
}
.fword.live .c {
  transition:
    transform 0.35s var(--ease),
    color 0.35s;
}
.fw-cur {
  flex: none;
  width: 0.52em;
  height: 0.62em;
  margin: 0 0 0.04em 0.06em;
  background: var(--warm);
  clip-path: polygon(0 0, calc(100% - 0.12em) 0, 100% 0.12em, 100% 100%, 0 100%);
  animation: cblink 1.1s steps(1) infinite;
}
.fword.pre .fw-cur {
  opacity: 0;
  animation: none;
}
@keyframes cblink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.12;
  }
}
.fbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 28px;
  justify-content: space-between;
  padding: 18px 8px calc(24px + env(safe-area-inset-bottom, 0px));
  font: 400 10px/1.4 var(--f-px);
  letter-spacing: 0.14em;
  color: var(--dim);
}
.fbar p {
  margin: 0;
}
@media (max-width: 980px) {
  .fp-top {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .fp-id,
  .fp-btn {
    grid-column: 1 / -1;
    justify-self: start;
  }
}
@media (max-width: 640px) {
  .foot {
    padding: 12px 12px 0;
  }
  .fword {
    flex-wrap: wrap;
  }
  .fw-l:first-child {
    flex-basis: 100%;
  }
}
</style>
