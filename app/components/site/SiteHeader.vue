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
/** blips are a top-page thing, so the switch shows only there */
const sound = useSound()
/** set by the top page while a section is on screen */
const activeSection = useState<string | null>('active-section', () => null)

function isCurrent(item: NavItem): boolean {
  if (route.path === '/') return activeSection.value === item.section
  return (item.paths ?? []).some(prefix => route.path.startsWith(prefix))
}
</script>

<template>
  <header
    class="top"
    :class="{ home: route.path === '/' }"
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
    <button
      v-if="route.path === '/'"
      class="hbtn hov"
      type="button"
      data-sound-toggle
      :aria-pressed="sound.on.value"
      @click="sound.set(!sound.on.value)"
    >
      <span
        class="eq"
        aria-hidden="true"
      ><i /><i /><i /><i /></span><RollText
        class="snd-label"
        text="SOUND"
      />
    </button>
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
.hbtn {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  font: 400 11px/1 var(--f-px);
  letter-spacing: 0.12em;
  color: var(--ink);
  background: transparent;
  border: 0;
  box-shadow: inset 0 0 0 1px var(--line);
  cursor: pointer;
  overflow: hidden;
  isolation: isolate;
  transition: color 0.3s;
}
.hbtn::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: -2em;
  right: -2em;
  background: var(--aqua);
  transform: translateX(-104%) skewX(-45deg);
  transition: transform 0.6s var(--ease);
  z-index: -1;
}
.hbtn:hover::before,
.hbtn:focus-visible::before {
  transform: translateX(0) skewX(-45deg);
}
.hbtn:hover,
.hbtn:focus-visible {
  color: var(--base);
  outline: none;
}
.eq {
  display: inline-flex;
  align-items: flex-end;
  gap: 2px;
  height: 11px;
}
.eq i {
  display: block;
  width: 2px;
  height: 3px;
  background: currentColor;
}
[aria-pressed='true'] .eq i {
  animation: eq 0.7s ease-in-out infinite alternate;
}
[aria-pressed='true'] .eq i:nth-child(2) {
  animation-delay: 0.15s;
}
[aria-pressed='true'] .eq i:nth-child(3) {
  animation-delay: 0.3s;
}
[aria-pressed='true'] .eq i:nth-child(4) {
  animation-delay: 0.45s;
}
@keyframes eq {
  to {
    height: 11px;
  }
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
/* the top page, as in its prototype */
.top.home {
  background: rgba(13, 28, 31, 0.78);
}
@media (max-width: 640px) {
  .nav a:not(.cur) {
    display: none;
  }
  .home .nav {
    display: none;
  }
  .home .hbtn {
    margin-left: auto;
  }
  .snd-label {
    display: none;
  }
}
</style>
