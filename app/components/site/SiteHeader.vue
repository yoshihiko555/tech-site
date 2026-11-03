<script setup lang="ts">
interface NavItem {
  label: string
  to: string
  /** section id on the top page, or a path prefix elsewhere */
  section?: string
  paths?: string[]
}

const NAV: NavItem[] = [
  { label: '<about/>', to: '/#status', section: 'status' },
  { label: '<writing/>', to: '/blog', section: 'posts', paths: ['/blog', '/categories', '/tags'] },
  { label: '<log/>', to: '/#episodes', section: 'episodes' },
  { label: '<works/>', to: '/#works', section: 'works' },
]

const route = useRoute()
/** set by the top page while a section is on screen */
const activeSection = useState<string | null>('active-section', () => null)

function isCurrent(item: NavItem): boolean {
  if (route.path === '/') return activeSection.value === item.section
  return (item.paths ?? []).some(prefix => route.path.startsWith(prefix))
}
</script>

<template>
  <header
    id="top"
    class="top"
  >
    <NuxtLink
      class="brand"
      to="/"
      aria-label="yoshihiko.tech top"
    >
      <LogoMark />
      YOSHIHIKO.TECH
    </NuxtLink>
    <nav
      class="nav"
      aria-label="Site"
    >
      <NuxtLink
        v-for="item in NAV"
        :key="item.to"
        :to="item.to"
        :class="{ cur: isCurrent(item) }"
        :aria-current="isCurrent(item) ? 'page' : undefined"
      >
        {{ item.label }}
      </NuxtLink>
    </nav>
    <i
      class="progress"
      aria-hidden="true"
    />
  </header>
</template>

<style scoped>
/* ---------- header ---------- */
.top {
  position: sticky;
  top: env(safe-area-inset-top, 0px);
  z-index: 30;
  height: var(--head);
  display: flex;
  align-items: center;
  gap: 16px;
  padding-left: var(--gut-l);
  padding-right: var(--gut-r);
  background: rgba(13, 28, 31, 0.82);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(92, 201, 190, 0.16);
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  font: 400 11px/1 var(--f-px);
  letter-spacing: 0.14em;
  white-space: nowrap;
}
.brand svg {
  width: 22px;
  height: 22px;
}
.nav {
  display: flex;
  gap: 4px;
  margin-left: auto;
}
.nav a {
  padding: 8px 10px;
  font: 400 11px/1 var(--f-px);
  letter-spacing: 0.12em;
  text-decoration: none;
  color: var(--dim);
  transition:
    color 0.3s,
    background-color 0.3s;
}
.nav a:hover {
  color: var(--ink);
}
.nav a.cur {
  color: var(--base);
  background: var(--warm);
}
.progress {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  background: var(--warm);
  transform-origin: left;
  transform: scaleX(var(--rp, 0));
}
@media (max-width: 640px) {
  .nav a:not(.cur) {
    display: none;
  }
}
</style>
