<script setup lang="ts">
/** Film grain, scanlines and the occasional bright sweep over the whole top page. */
const sweep = ref<HTMLElement | null>(null)
let timer: ReturnType<typeof setTimeout> | undefined

function schedule() {
  timer = setTimeout(
    () => {
      if (!citySignals.covered && !document.hidden) replayClass(sweep.value, 'run', 2500)
      schedule()
    },
    7000 + Math.random() * 6000,
  )
}

onMounted(() => {
  if (!prefersReducedMotion()) schedule()
})
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div
    class="grain"
    aria-hidden="true"
  />
  <div
    class="scanlines"
    aria-hidden="true"
  />
  <div
    ref="sweep"
    class="sweepline"
    aria-hidden="true"
  />
</template>

<style scoped>
.scanlines {
  position: fixed;
  inset: 0;
  z-index: 20;
  pointer-events: none;
  background: repeating-linear-gradient(to bottom, rgba(0, 0, 0, 0) 0 2px, rgba(0, 0, 0, 0.06) 2px 3px);
}
.grain {
  position: fixed;
  inset: -60%;
  z-index: 21;
  pointer-events: none;
  opacity: 0.08;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  animation: grain 1.2s steps(4) infinite;
}
@keyframes grain {
  0% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(-3%, 2%);
  }
  50% {
    transform: translate(2%, -3%);
  }
  75% {
    transform: translate(-2%, 3%);
  }
  100% {
    transform: translate(0, 0);
  }
}
.sweepline {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 140px;
  z-index: 40;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(92, 201, 190, 0.07) 70%,
    rgba(238, 231, 218, 0.16) 96%,
    transparent
  );
  mix-blend-mode: screen;
  transform: translateY(-160px);
  opacity: 0;
}
.sweepline.run {
  opacity: 1;
  animation: sweepdown 2.4s cubic-bezier(0.45, 0, 0.55, 1) both;
}
@keyframes sweepdown {
  to {
    transform: translateY(calc(100vh + 20px));
  }
}
@media (prefers-reduced-motion: reduce) {
  .grain {
    animation: none;
  }
}
</style>
