<script setup lang="ts">
/**
 * Section heading: a wide title split into letters (slides up on first view,
 * stretches with the scroll, glitches now and then) with meta text on the right.
 * `tiles` draws each letter on a gradient tile instead (WORKS).
 */
const props = defineProps<{
  id: string
  title: string
  meta?: string
  variant?: 'split' | 'tiles'
}>()

const sound = useSound()
const root = ref<HTMLElement | null>(null)
const heading = ref<HTMLElement | null>(null)
const chars = computed(() => Array.from(props.title))
const shown = useReveal(heading)
const inView = useInView(heading)
let width = ''

watch(inView, (on) => {
  if (heading.value && props.variant !== 'tiles') setTitleVisible(heading.value, on)
})
onBeforeUnmount(() => {
  if (heading.value) setTitleVisible(heading.value, false)
})

useFrame(({ vh }) => {
  if (props.variant === 'tiles' || !inView.value || !heading.value || prefersReducedMotion()) return
  const top = heading.value.getBoundingClientRect().top
  const p = clamp((vh - top) / (vh * 0.65), 0, 1)
  const next = (62 + p * 78).toFixed(1)
  if (next === width) return
  width = next
  heading.value.style.fontVariationSettings = `"wght" 500, "wdth" ${next}`
})

function glitch() {
  if (props.variant !== 'tiles') replayClass(heading.value, 'glx', 360)
}
</script>

<template>
  <div
    ref="root"
    class="sec-head"
    :class="{ pre: !shown }"
  >
    <h2
      :id="id"
      ref="heading"
      :class="[variant === 'tiles' ? 'tiles' : 'st', { pre: !shown }]"
      :data-text="title"
      @pointerenter="glitch"
    >
      <span class="sr-only">{{ title }}</span
      ><span
        v-for="(ch, i) in chars"
        :key="i"
        class="c"
        aria-hidden="true"
        :style="{ '--i': i }"
        @pointerenter="variant === 'tiles' ? sound.hover() : undefined"
        >{{ ch }}</span
      >
    </h2>
    <div class="sec-side">
      <p
        v-if="meta"
        class="sec-meta"
      >
        <slot name="meta">{{ meta }}</slot>
      </p>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.sec-head {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px 24px;
  flex-wrap: wrap;
  margin-bottom: 40px;
  padding-bottom: 18px;
}
.sec-head::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1.5px;
  background: currentColor;
  opacity: 0.4;
  transform-origin: left;
  transition: transform 1.4s var(--ease);
}
.sec-head.pre::after {
  transform: scaleX(0);
}
.st {
  position: relative;
  margin: 0;
  display: flex;
  overflow: hidden;
  padding: 0.1em 0 0.06em;
  font-family: var(--f-wide);
  font-weight: 400;
  font-variation-settings:
    'wght' 500,
    'wdth' 140;
  font-size: clamp(34px, 6vw, 96px);
  line-height: 1;
  letter-spacing: 0.14em;
  text-shadow:
    calc(var(--v, 0) * 5px) 0 var(--st-a, rgba(92, 201, 190, 0.55)),
    calc(var(--v, 0) * -5px) 0 var(--st-b, rgba(220, 106, 53, 0.55));
}
.st .c {
  display: inline-block;
  transition:
    transform 1.1s var(--ease),
    opacity 0.6s;
  transition-delay: calc(var(--i) * 45ms);
}
.st.pre .c {
  transform: translateY(120%);
  opacity: 0;
}
.st::before,
.st::after {
  content: attr(data-text);
  position: absolute;
  left: 0;
  top: 0;
  padding: inherit;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
}
.st.glx::before {
  opacity: 1;
  color: var(--aqua);
  animation: glx1 0.34s steps(4) both;
}
.st.glx::after {
  opacity: 1;
  color: var(--glx2, var(--warm));
  animation: glx2 0.34s steps(4) both;
}
@keyframes glx1 {
  0% {
    clip-path: inset(8% 0 72% 0);
    transform: translate(-8px, 0);
  }
  25% {
    clip-path: inset(52% 0 22% 0);
    transform: translate(6px, 0);
  }
  50% {
    clip-path: inset(30% 0 50% 0);
    transform: translate(-4px, 0);
  }
  75% {
    clip-path: inset(76% 0 4% 0);
    transform: translate(5px, 0);
  }
  100% {
    clip-path: inset(0 0 100% 0);
  }
}
@keyframes glx2 {
  0% {
    clip-path: inset(60% 0 12% 0);
    transform: translate(7px, 0);
  }
  25% {
    clip-path: inset(18% 0 64% 0);
    transform: translate(-6px, 0);
  }
  50% {
    clip-path: inset(70% 0 8% 0);
    transform: translate(4px, 0);
  }
  75% {
    clip-path: inset(40% 0 40% 0);
    transform: translate(-5px, 0);
  }
  100% {
    clip-path: inset(0 0 100% 0);
  }
}

/* WORKS: one gradient tile per letter */
.tiles {
  display: flex;
  gap: clamp(4px, 0.7vw, 10px);
  margin: 0;
}
.tiles .c {
  position: relative;
  display: grid;
  place-items: center;
  width: clamp(52px, 8.5vw, 128px);
  aspect-ratio: 1;
  overflow: hidden;
  background: linear-gradient(140deg, #e8b79a, #dc6a35 45%, #173a3d);
  color: #f6efe3;
  font-family: var(--f-wide);
  font-weight: 400;
  font-variation-settings:
    'wght' 600,
    'wdth' 120;
  font-size: clamp(32px, 5.6vw, 88px);
  line-height: 1;
  transition:
    filter 1.1s var(--ease),
    transform 1.1s var(--ease),
    opacity 0.6s;
  transition-delay: calc(var(--i) * 80ms);
}
.tiles .c:nth-child(2n) {
  background: linear-gradient(200deg, #5cc9be, #173a3d 55%, #e2b04a);
}
.tiles .c:nth-child(3n) {
  background: linear-gradient(60deg, #e2b04a, #e8b79a 50%, #5cc9be);
}
.tiles .c::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.12) 0 1px, transparent 1px 4px);
  pointer-events: none;
}
.tiles.pre .c {
  filter: blur(16px) saturate(1.6);
  transform: scale(0.86);
  opacity: 0;
}
.tiles .c:hover {
  transform: translateY(-6px);
  transition-delay: 0s;
}

.sec-side {
  display: flex;
  align-items: center;
  gap: 20px;
  padding-bottom: 0.4em;
}
.sec-meta {
  margin: 0;
  font: 400 11px/1 var(--f-px);
  letter-spacing: 0.12em;
  opacity: 0.8;
}
@media (prefers-reduced-motion: reduce) {
  .sec-head::after,
  .st .c,
  .tiles .c {
    transition: none;
  }
}
</style>
