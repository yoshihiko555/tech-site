<script setup lang="ts">
/** Text whose letters roll up to a second copy while the nearest `.hov` parent is hovered. */
const props = defineProps<{ text: string }>()
const chars = computed(() => Array.from(props.text, (ch) => (ch === ' ' ? ' ' : ch)))
</script>

<template>
  <span class="rl"
    ><span class="sr-only">{{ text }}</span
    ><span
      class="rl-a"
      aria-hidden="true"
      ><span
        v-for="(ch, i) in chars"
        :key="i"
        class="c"
        :style="{ '--i': i }"
        >{{ ch }}</span
      ></span
    ><span
      class="rl-b"
      aria-hidden="true"
      ><span
        v-for="(ch, i) in chars"
        :key="i"
        class="c"
        :style="{ '--i': i }"
        >{{ ch }}</span
      ></span
    ></span
  >
</template>

<style scoped>
.rl {
  position: relative;
  display: inline-block;
  overflow: hidden;
  vertical-align: top;
  line-height: 1.2;
}
.rl-a,
.rl-b {
  display: block;
  white-space: pre;
}
.rl-b {
  position: absolute;
  left: 0;
  top: 0;
}
.c {
  display: inline-block;
  transition: transform 0.6s var(--ease);
  transition-delay: calc(var(--i) * 14ms);
}
.rl-b .c {
  transform: translateY(115%);
}
.hov:hover .rl-a .c,
.hov:focus-visible .rl-a .c {
  transform: translateY(-115%);
}
.hov:hover .rl-b .c,
.hov:focus-visible .rl-b .c {
  transform: none;
}
</style>
