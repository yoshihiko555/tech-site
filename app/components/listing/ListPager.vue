<script setup lang="ts">
defineProps<{
  page: number
  pages: number
  basePath: string
}>()
</script>

<template>
  <nav
    v-if="pages > 1"
    class="pager"
    aria-label="Pages"
  >
    <NuxtLink
      v-if="page > 1"
      :to="pagePath(basePath, page - 1)"
    >
      ← PREV
    </NuxtLink>
    <span
      v-else
      class="off"
    >← PREV</span>
    <template
      v-for="n in pages"
      :key="n"
    >
      <span
        v-if="n === page"
        aria-current="page"
      >{{ String(n).padStart(2, '0') }}</span>
      <NuxtLink
        v-else
        :to="pagePath(basePath, n)"
      >
        {{ String(n).padStart(2, '0') }}
      </NuxtLink>
    </template>
    <span class="gap" />
    <NuxtLink
      v-if="page < pages"
      :to="pagePath(basePath, page + 1)"
    >
      NEXT →
    </NuxtLink>
    <span
      v-else
      class="off"
    >NEXT →</span>
  </nav>
</template>

<style scoped>
.pager {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px;
  padding-top: 12px;
  font: 400 11px/1 var(--f-px);
  letter-spacing: 0.14em;
}
.pager a,
.pager span {
  padding: 12px 14px;
  text-decoration: none;
  color: var(--dim);
  background: var(--base-2);
  font-variant-numeric: tabular-nums;
}
.pager a:hover {
  color: var(--ink);
  background: var(--deep);
}
.pager [aria-current="page"] {
  color: var(--base);
  background: var(--warm);
}
.pager .gap {
  flex: 1;
  background: transparent;
}
.pager .off {
  opacity: 0.35;
}
</style>
