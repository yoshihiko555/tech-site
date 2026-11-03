<script setup lang="ts">
/**
 * Layout of the top page: the WebGL city behind everything, grain and scanlines on top,
 * the side rail, and the large closing footer instead of the slim one.
 */
onMounted(() => {
  // grain masks for the edges of the colour worlds (HomeWorld)
  const root = document.documentElement.style
  root.setProperty('--dz-in', ditherMask(true))
  root.setProperty('--dz-out', ditherMask(false))
})
onBeforeUnmount(() => {
  const root = document.documentElement.style
  root.removeProperty('--dz-in')
  root.removeProperty('--dz-out')
})
</script>

<template>
  <div class="site home">
    <CityShader />
    <HomeAtmosphere />
    <HomeRail />
    <SiteHeader />
    <main id="main">
      <slot />
    </main>
    <HomeFooter />
    <CrosshairCursor />
  </div>
</template>

<style scoped>
/* giant type and the episode track run past the edges */
main {
  overflow-x: clip;
}
</style>
