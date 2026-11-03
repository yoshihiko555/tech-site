<script setup lang="ts">
/**
 * A full-width colour world (warm STATUS, teal WRITING, pastel WORKS). Its top and
 * bottom edges dissolve into the page in grains (masks set by the home layout).
 */
defineProps<{
  tone: 'warm' | 'teal' | 'pastel'
  /** paper texture over the colour */
  texture?: boolean
}>()
</script>

<template>
  <section
    class="world"
    :class="`w-${tone}`"
  >
    <slot name="back" />
    <div
      v-if="texture"
      class="tex"
      aria-hidden="true"
    />
    <slot />
  </section>
</template>

<style scoped>
.world {
  position: relative;
  background-color: var(--wbg);
  color: var(--wfg);
  scroll-margin-top: var(--head);
}
.world::before,
.world::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 120px;
  background: var(--wbg);
  pointer-events: none;
  -webkit-mask-repeat: repeat-x;
  mask-repeat: repeat-x;
  -webkit-mask-size: 512px 120px;
  mask-size: 512px 120px;
}
/* plain gradients until the grain masks are drawn in the browser */
.world::before {
  bottom: 100%;
  -webkit-mask-image: var(--dz-in, linear-gradient(transparent, #000));
  mask-image: var(--dz-in, linear-gradient(transparent, #000));
}
.world::after {
  top: 100%;
  -webkit-mask-image: var(--dz-out, linear-gradient(#000, transparent));
  mask-image: var(--dz-out, linear-gradient(#000, transparent));
}
.tex {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.5;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
}
.w-warm {
  --wbg: var(--warm);
  --wfg: #18120f;
  /* section titles: split shadows and the second glitch slice */
  --st-a: rgba(92, 201, 190, 0.7);
  --st-b: rgba(238, 231, 218, 0.6);
  --glx2: var(--base);
}
.w-teal {
  --wbg: var(--deep);
  --wfg: var(--ink);
}
.w-pastel {
  --wbg: #a8cfc4;
  --wfg: #10201f;
  background-image:
    radial-gradient(70% 90% at 15% 20%, #e8b79a, transparent 70%),
    radial-gradient(60% 80% at 85% 70%, #8fc4ba, transparent 70%);
}
.w-pastel .tex {
  opacity: 0.6;
}
</style>
