<template>
  <div class="sec">
    <slot />
  </div>
</template>

<style scoped>
.sec {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: max(var(--gut-l), 48px);
  padding-right: var(--gut-r);
  padding-block: 112px 104px;
}
@media (max-width: 640px) {
  .sec {
    padding-left: var(--gut-l);
  }
}
</style>
