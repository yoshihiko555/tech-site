<template>
  <footer class="foot">
    <div class="fbar">
      <p>© {{ year }} YOSHIHIKO</p>
      <nav aria-label="Elsewhere">
        <a
          href="https://github.com/yoshihiko555"
          target="_blank"
          rel="noopener"
        >GITHUB ↗</a>
        <a
          href="https://twitter.com/yoshihiko5555"
          target="_blank"
          rel="noopener"
        >X ↗</a>
        <a
          href="/feed.xml"
          target="_blank"
          rel="noopener"
        >RSS ↗</a>
      </nav>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<style scoped>
/* ---------- footer (same as the top page) ---------- */
.foot {
  padding: 18px max(18px, var(--gut-r)) 0 max(18px, var(--gut-l));
  border-top: 1px solid rgba(92, 201, 190, 0.12);
}
.fbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 28px;
  justify-content: space-between;
  align-items: center;
  padding: 18px 8px calc(24px + env(safe-area-inset-bottom, 0px));
  font: 400 10px/1.4 var(--f-px);
  letter-spacing: 0.14em;
  color: var(--dim);
}
.fbar p {
  margin: 0;
}
.fbar a {
  text-decoration: none;
  color: var(--ink);
}
.fbar nav {
  display: flex;
  gap: 16px;
}
</style>
