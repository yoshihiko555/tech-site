<script setup lang="ts">
import type { TermWithCount } from '#shared/types/post'

const props = defineProps<{
  total: number
  categories: TermWithCount[]
  tags: TermWithCount[]
  currentCategory?: string
  currentTag?: string
}>()

const cloudOpen = ref(!!props.currentTag)
const usedTags = computed(() => props.tags.filter(tag => tag.count > 0))
</script>

<template>
  <div class="filters">
    <nav
      class="cats"
      aria-label="Categories"
    >
      <NuxtLink
        to="/blog"
        :class="{ on: !currentCategory && !currentTag }"
      >
        ALL <b>{{ total }}</b>
      </NuxtLink>
      <NuxtLink
        v-for="category in categories"
        :key="category.slug"
        :to="`/categories/${category.slug}`"
        :class="{ on: category.slug === currentCategory }"
      >
        {{ category.name.toUpperCase() }} <b>{{ category.count }}</b>
      </NuxtLink>
      <button
        class="tagtoggle"
        type="button"
        aria-controls="tag-cloud"
        :aria-expanded="cloudOpen"
        @click="cloudOpen = !cloudOpen"
      >
        TAGS <b>{{ usedTags.length }}</b>
      </button>
    </nav>
    <ul
      v-show="cloudOpen"
      id="tag-cloud"
      class="cloud"
      aria-label="Tags"
    >
      <li
        v-for="tag in usedTags"
        :key="tag.slug"
      >
        <NuxtLink
          :to="`/tags/${tag.slug}`"
          :class="{ on: tag.slug === currentTag }"
        >
          #{{ tag.name }}<small>{{ tag.count }}</small>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.filters {
  display: grid;
  gap: 22px;
}
.cats {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}
.cats a,
.tagtoggle {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 12px 16px;
  font: 400 11px/1 var(--f-px);
  letter-spacing: 0.14em;
  text-decoration: none;
  color: var(--dim);
  background: var(--base-2);
  border: 0;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
}
.cats a b,
.tagtoggle b {
  font: 400 12px/1 var(--f-mono);
  color: var(--ink);
}
.cats a:hover,
.tagtoggle:hover {
  color: var(--ink);
  background: var(--deep);
}
.cats a.on {
  color: var(--base);
  background: var(--warm);
}
.cats a.on b {
  color: var(--base);
}
.tagtoggle {
  margin-left: auto;
}
.tagtoggle[aria-expanded="true"] {
  color: var(--base);
  background: var(--aqua);
}
.tagtoggle[aria-expanded="true"] b {
  color: var(--base);
}
.cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0;
  padding: 16px;
  list-style: none;
  background: var(--base-2);
}
.cloud a {
  display: block;
  padding: 6px 9px;
  font: 500 13px/1 var(--f-sans);
  text-decoration: none;
  color: var(--ink);
  box-shadow: inset 0 0 0 1px var(--line);
  transition:
    background 0.2s,
    color 0.2s;
}
.cloud a small {
  margin-left: 6px;
  font: 400 10px/1 var(--f-mono);
  color: var(--dim);
}
.cloud a:hover,
.cloud a.on {
  background: var(--aqua);
  color: var(--base);
}
.cloud a:hover small,
.cloud a.on small {
  color: var(--base);
}
@media (max-width: 760px) {
  .tagtoggle {
    margin-left: 0;
  }
}
</style>
