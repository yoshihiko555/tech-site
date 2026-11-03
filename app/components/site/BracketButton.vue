<script setup lang="ts">
/**
 * [ LABEL ] button in pixel type: a 45° colour wipe on hover, a short jolt when pressed,
 * and (with `magnetic`) a slight pull toward the pointer. A link when `to` is given.
 */
const props = defineProps<{
  label: string
  to?: string
  tone?: 'aqua' | 'warm'
  magnetic?: boolean
  /** word the crosshair shows over it */
  cursor?: string
}>()
defineEmits<{ click: [event: MouseEvent] }>()

const external = computed(() => !!props.to && /^https?:/.test(props.to))

function onMove(e: PointerEvent) {
  if (!props.magnetic || e.pointerType !== 'mouse' || prefersReducedMotion()) return
  const el = e.currentTarget as HTMLElement
  const box = el.getBoundingClientRect()
  const dx = e.clientX - (box.left + box.width / 2)
  const dy = e.clientY - (box.top + box.height / 2)
  el.style.transition = 'transform .15s linear'
  el.style.transform = `translate(${(dx * 0.18).toFixed(1)}px,${(dy * 0.26).toFixed(1)}px)`
}
function onLeave(e: PointerEvent) {
  if (!props.magnetic) return
  const el = e.currentTarget as HTMLElement
  el.style.transition = 'transform .8s cubic-bezier(.16,1,.3,1)'
  el.style.transform = ''
}
function onDown(e: PointerEvent) {
  replayClass(e.currentTarget as HTMLElement, 'zap', 320)
}
</script>

<template>
  <NuxtLink
    v-if="to"
    class="btn hov"
    :class="{ warm: tone === 'warm' }"
    :to="to"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener' : undefined"
    :data-cursor="cursor"
    @pointermove="onMove"
    @pointerleave="onLeave"
    @pointerdown="onDown"
    ><span class="br">[</span><RollText :text="label" /><span class="br">]</span></NuxtLink
  >
  <button
    v-else
    type="button"
    class="btn hov"
    :class="{ warm: tone === 'warm' }"
    :data-cursor="cursor"
    @pointermove="onMove"
    @pointerleave="onLeave"
    @pointerdown="onDown"
    @click="$emit('click', $event)"
  >
    <span class="br">[</span><RollText :text="label" /><span class="br">]</span>
  </button>
</template>

<style scoped>
.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.6em;
  padding: 12px 18px;
  font: 400 13px/1 var(--f-px);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink);
  background: rgba(13, 28, 31, 0.55);
  text-decoration: none;
  border: 0;
  cursor: pointer;
  overflow: hidden;
  isolation: isolate;
  box-shadow: inset 0 0 0 1px var(--aqua);
  transition: color 0.3s;
  will-change: transform;
}
.btn::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: -2.4em;
  right: -2.4em;
  background: var(--wipe, var(--aqua));
  transform: translateX(-104%) skewX(-45deg);
  transition: transform 0.7s var(--ease);
  z-index: -1;
}
.btn:hover::before,
.btn:focus-visible::before {
  transform: translateX(0) skewX(-45deg);
}
.btn:hover,
.btn:focus-visible {
  color: var(--base);
  outline: none;
}
.br {
  color: var(--aqua);
  transition: color 0.3s;
}
.btn:hover .br,
.btn:focus-visible .br {
  color: var(--base);
}
.btn.warm {
  box-shadow: inset 0 0 0 1px var(--warm);
  --wipe: var(--warm);
}
.btn.warm .br {
  color: var(--warm);
}
.zap {
  animation: zap 0.3s steps(3) 1;
}
@keyframes zap {
  0% {
    transform: translate(-3px, 0);
  }
  33% {
    transform: translate(3px, -1px);
  }
  66% {
    transform: translate(-1px, 1px);
  }
  100% {
    transform: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .btn::before {
    transition: none;
  }
}
</style>
