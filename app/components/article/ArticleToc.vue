<script setup lang="ts">
import type { Heading } from '#shared/types/post'

const props = defineProps<{
  headings: Heading[]
  /** rail: sticky column on wide screens; menu: folding list above the text on narrow ones */
  variant: 'rail' | 'menu'
  activeId?: string | null
  activeSubId?: string | null
}>()

interface Section {
  id: string
  no: string
  text: string
  children: { id: string, no: string, text: string }[]
}

const sections = computed<Section[]>(() => {
  const list: Section[] = []
  for (const heading of props.headings) {
    if (heading.level === 2) {
      list.push({ id: heading.id, no: String(list.length + 1).padStart(2, '0'), text: heading.text, children: [] })
      continue
    }
    const parent = list[list.length - 1]
    if (parent) parent.children.push({ id: heading.id, no: `${parent.no}.${parent.children.length + 1}`, text: heading.text })
  }
  return list
})

const menu = ref<HTMLDetailsElement | null>(null)
function closeMenu() {
  if (menu.value) menu.value.open = false
}
</script>

<template>
  <aside
    v-if="variant === 'rail'"
    class="toc"
    aria-label="Contents"
  >
    <h2>[ CONTENTS ]</h2>
    <div
      class="toc-track"
      aria-hidden="true"
    >
      <i />
    </div>
    <ol>
      <li
        v-for="section in sections"
        :key="section.id"
        :class="{ on: section.id === activeId }"
      >
        <a :href="`#${section.id}`"><span class="no">{{ section.no }}</span><span>{{ section.text }}</span></a>
        <ol v-if="section.children.length">
          <li
            v-for="child in section.children"
            :key="child.id"
            :class="{ on: child.id === activeSubId }"
          >
            <a :href="`#${child.id}`"><span class="no">{{ child.no }}</span><span>{{ child.text }}</span></a>
          </li>
        </ol>
      </li>
    </ol>
  </aside>
  <details
    v-else
    ref="menu"
    class="toc-mobile"
  >
    <summary>[ CONTENTS ]</summary>
    <ol @click="closeMenu">
      <li
        v-for="section in sections"
        :key="section.id"
      >
        <a :href="`#${section.id}`"><span class="no">{{ section.no }}</span><span>{{ section.text }}</span></a>
      </li>
    </ol>
  </details>
</template>

<style scoped>
.toc {
  position: sticky;
  top: calc(var(--head) + 28px);
  align-self: start;
  max-height: calc(100vh - var(--head) - 56px);
  overflow: auto;
  padding-left: 14px;
}
.toc h2 {
  margin: 0 0 14px;
  font: 400 11px/1 var(--f-px);
  letter-spacing: 0.14em;
  color: var(--warm);
}
.toc-track {
  position: absolute;
  left: 0;
  top: 26px;
  bottom: 0;
  width: 2px;
  background: rgba(238, 231, 218, 0.1);
}
.toc-track i {
  display: block;
  width: 100%;
  height: 100%;
  background: var(--warm);
  transform-origin: top;
  transform: scaleY(var(--rp, 0));
}
.toc ol {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 2px;
}
.toc a {
  display: grid;
  grid-template-columns: 2.2em minmax(0, 1fr);
  gap: 6px;
  padding: 7px 8px;
  text-decoration: none;
  color: var(--dim);
  font: 500 13px/1.55 var(--f-ja);
  transition:
    color 0.2s,
    background 0.2s;
}
.toc a .no {
  font: 400 11px/1.9 var(--f-mono);
  color: inherit;
  opacity: 0.8;
}
.toc a:hover {
  color: var(--ink);
}
.toc li.on > a {
  color: var(--ink);
  background: rgba(92, 201, 190, 0.08);
  box-shadow: inset 2px 0 0 var(--warm);
}
.toc ol ol {
  display: none;
  margin: 2px 0 6px;
}
.toc li.on > ol {
  display: grid;
}
.toc ol ol a {
  grid-template-columns: 2.2em minmax(0, 1fr);
  padding: 4px 8px;
  font-size: 12px;
}
.toc ol ol li.on > a {
  background: none;
  box-shadow: none;
  color: var(--aqua);
}
.toc-mobile {
  display: none;
  box-shadow: inset 0 0 0 1px var(--line);
}
.toc-mobile summary {
  padding: 12px 14px;
  font: 400 11px/1 var(--f-px);
  letter-spacing: 0.14em;
  color: var(--warm);
  cursor: pointer;
}
.toc-mobile ol {
  margin: 0;
  padding: 0 8px 10px;
  list-style: none;
}
.toc-mobile a {
  display: grid;
  grid-template-columns: 2.2em minmax(0, 1fr);
  gap: 6px;
  padding: 6px;
  text-decoration: none;
  font: 500 14px/1.6 var(--f-ja);
  color: var(--ink);
}
.toc-mobile a .no {
  font: 400 11px/1.9 var(--f-mono);
  color: var(--warm);
}
@media (max-width: 980px) {
  .toc {
    display: none;
  }
  .toc-mobile {
    display: block;
  }
}
</style>
