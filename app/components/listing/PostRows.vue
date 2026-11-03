<script setup lang="ts">
import type { PostMeta } from '#shared/types/post'

const props = defineProps<{
  /** posts on this page */
  posts: PostMeta[]
  /** every match in the scope, for the per-year counts */
  matches: PostMeta[]
  query: string
}>()

interface YearGroup {
  year: string
  total: number
  posts: PostMeta[]
}

const groups = computed<YearGroup[]>(() => {
  const list: YearGroup[] = []
  for (const post of props.posts) {
    const year = formatDate(post.publishedAt).slice(0, 4)
    let group = list[list.length - 1]
    if (!group || group.year !== year) {
      group = {
        year,
        total: props.matches.filter(p => formatDate(p.publishedAt).startsWith(year)).length,
        posts: [],
      }
      list.push(group)
    }
    group.posts.push(post)
  }
  return list
})

/** splits a title around the first match of the query, for highlighting */
function parts(title: string): [string, string, string] {
  const term = props.query.trim().toLowerCase()
  const at = term ? title.toLowerCase().indexOf(term) : -1
  if (at < 0) return [title, '', '']
  return [title.slice(0, at), title.slice(at, at + term.length), title.slice(at + term.length)]
}

function order(post: PostMeta): number {
  return props.posts.indexOf(post)
}
</script>

<template>
  <div class="rows rows-in">
    <section
      v-for="group in groups"
      :key="group.year"
      class="year"
    >
      <h2>{{ group.year }}<small>{{ group.total }} {{ group.total === 1 ? 'POST' : 'POSTS' }}</small></h2>
      <ol>
        <li
          v-for="post in group.posts"
          :key="post.slug"
          class="post"
          :style="{ '--k': order(post) }"
        >
          <NuxtLink
            :to="`/blog/${post.slug}`"
            data-cursor="READ"
          >
            <time :datetime="post.publishedAt">{{ formatDate(post.publishedAt) }}</time>
            <span class="cat">{{ post.category?.name.toUpperCase() ?? 'POST' }}</span>
            <span class="t">{{ parts(post.title)[0] }}<mark v-if="parts(post.title)[1]">{{ parts(post.title)[1] }}</mark>{{ parts(post.title)[2] }}</span>
            <span
              v-if="post.tags.length"
              class="tg"
            >{{ post.tags.map(tag => `#${tag.name}`).join('  ') }}</span>
          </NuxtLink>
        </li>
      </ol>
    </section>
  </div>
</template>

<style scoped>
.rows {
  display: grid;
  gap: 2px;
}
.year {
  display: grid;
  gap: 2px;
}
.year h2 {
  margin: 18px 0 8px;
  display: flex;
  align-items: baseline;
  gap: 14px;
  font-family: var(--f-wide);
  font-variation-settings:
    "wght" 300,
    "wdth" 150;
  font-size: clamp(28px, 3.4vw, 44px);
  line-height: 1;
  color: var(--ink);
}
.year h2::after {
  content: "";
  flex: 1;
  height: 1px;
  align-self: center;
  background: var(--line);
}
.year h2 small {
  order: 2;
  font: 400 10px/1 var(--f-px);
  letter-spacing: 0.14em;
  color: var(--dim);
}
.year ol {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 2px;
}
.post a {
  display: grid;
  grid-template-columns: 6.6em 7.4em minmax(0, 1fr);
  gap: 6px 18px;
  align-items: baseline;
  padding: 16px 18px;
  text-decoration: none;
  background: rgba(238, 231, 218, 0.035);
  transition:
    background 0.18s,
    color 0.18s;
}
.post time {
  font: 400 12px/1.6 var(--f-mono);
  color: var(--aqua);
}
.post .cat {
  justify-self: start;
  padding: 4px 6px;
  font: 400 9px/1 var(--f-px);
  letter-spacing: 0.12em;
  color: var(--dim);
  box-shadow: inset 0 0 0 1px var(--line);
}
.post .t {
  font: 700 16px/1.7 var(--f-ja);
  color: var(--ink);
}
.post .tg {
  grid-column: 3;
  font: 400 12px/1.5 var(--f-sans);
  color: var(--dim);
}
.post a:hover {
  background: var(--mustard);
}
.post a:hover time,
.post a:hover .t,
.post a:hover .tg,
.post a:hover .cat {
  color: #18120f;
}
.post a:hover .cat {
  box-shadow: inset 0 0 0 1px #18120f;
}
.post mark {
  color: var(--base);
  background: var(--warm);
}
.rows-in .post {
  animation: rowin 0.5s var(--ease) both;
  animation-delay: calc(var(--k) * 35ms);
}
@keyframes rowin {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}
.empty {
  margin: 0;
  padding: 28px 22px;
  display: grid;
  gap: 14px;
  justify-items: start;
  background: var(--base-2);
  font: 500 15px/1.8 var(--f-ja);
  color: var(--ink);
}
.empty button {
  padding: 10px 14px;
  font: 400 11px/1 var(--f-px);
  letter-spacing: 0.14em;
  color: var(--ink);
  background: transparent;
  border: 0;
  box-shadow: inset 0 0 0 1px var(--warm);
  cursor: pointer;
}
@media (max-width: 760px) {
  .post a {
    grid-template-columns: auto minmax(0, 1fr);
  }
  .post .t,
  .post .tg {
    grid-column: 1 / -1;
  }
}
</style>
