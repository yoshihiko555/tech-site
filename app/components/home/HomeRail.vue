<script setup lang="ts">
/** Left rail of the top page: scroll progress and the tag of the section on screen. */
const tag = useState('rail-tag', () => '<home/>')
const shown = useScrambleText(() => tag.value, { steps: 12 })
const bar = ref<HTMLElement | null>(null)
let last = ''

useFrame(({ y }) => {
  if (!bar.value) return
  const docH = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
  const next = clamp(y / docH, 0, 1).toFixed(4)
  if (next === last) return
  last = next
  bar.value.style.transform = `scaleY(${next})`
})
</script>

<template>
  <div
    class="rail"
    aria-hidden="true"
  >
    <i ref="bar" /><b>{{ shown }}</b>
  </div>
</template>

<style scoped>
.rail {
  position: fixed;
  left: max(10px, env(safe-area-inset-left, 0px));
  top: calc(var(--head) + 24px);
  bottom: 24px;
  z-index: 26;
  width: 18px;
  pointer-events: none;
}
.rail::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  background: rgba(238, 231, 218, 0.16);
}
i {
  position: absolute;
  top: 0;
  left: 50%;
  width: 2px;
  margin-left: -0.5px;
  height: 100%;
  background: var(--aqua);
  box-shadow: 0 0 6px rgba(92, 201, 190, 0.6);
  transform-origin: top;
  transform: scaleY(0);
}
b {
  position: absolute;
  top: 50%;
  left: 50%;
  font: 400 10px/1 var(--f-px);
  letter-spacing: 0.14em;
  white-space: nowrap;
  color: var(--ink);
  transform: translate(-50%, -50%) rotate(-90deg);
  background: var(--base);
  padding: 5px 9px;
  box-shadow: inset 0 0 0 1px var(--warm);
}
@media (max-width: 640px) {
  .rail {
    display: none;
  }
}
</style>
