<template>
  <div class="site">
    <SiteHeader />
    <main id="main">
      <slot />
    </main>
    <SiteFooter />
    <CrosshairCursor />
  </div>
</template>
