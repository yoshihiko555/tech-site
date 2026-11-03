<!-- #top is the page itself, not the sticky header (always at the top of the screen) -->
<template>
  <div
    id="top"
    class="site"
  >
    <SiteHeader />
    <main id="main">
      <slot />
    </main>
    <SiteFooter />
    <SearchPalette />
    <CrosshairCursor />
  </div>
</template>
