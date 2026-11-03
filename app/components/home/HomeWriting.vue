<script setup lang="ts">
import type { PostMeta } from '#shared/types/post'

/** WRITING: the latest posts as a file listing, with a preview of the row in focus. */
const props = defineProps<{ posts: PostMeta[] }>()

const list = ref<HTMLElement | null>(null)
const shown = useReveal(list)
const current = ref(0)
const post = computed(() => props.posts[current.value])
const title = useScrambleText(() => post.value?.title ?? '', { anyText: true })
const meta = computed(() =>
  post.value ? `${(post.value.category?.name ?? '').toUpperCase()} / ${formatDate(post.value.publishedAt)}` : '',
)
const tags = computed(() => post.value?.tags.map((tag) => `#${tag.name}`).join(' ') ?? '')

function select(i: number) {
  current.value = i
}
function onEnter(i: number, e: PointerEvent) {
  select(i)
  const box = (e.currentTarget as HTMLElement).getBoundingClientRect()
  citySignals.hover = { x: box.left + box.width / 2, y: box.top + box.height / 2 }
}
function onLeave() {
  citySignals.hover = null
}
onBeforeUnmount(onLeave)
</script>

<template>
  <HomeWorld
    id="posts"
    tone="teal"
    data-tag="<writing/>"
    data-nav="posts"
    aria-labelledby="posts-h"
  >
    <template #back>
      <GrainField kind="teal" />
    </template>
    <HomeContainer>
      <SectionHead
        id="posts-h"
        title="WRITING"
        :meta="`LATEST ${padNumber(posts.length, 2)}`"
      >
        <NuxtLink
          class="more hov"
          to="/blog"
          data-cursor="OPEN"
        >
          <RollText text="ALL ARTICLES" />
        </NuxtLink>
      </SectionHead>
      <div class="posts">
        <div class="files chamfer">
          <div class="files-bar">
            <span>~/writing $ ls --latest</span><i>{{ posts.length }} FILES</i>
          </div>
          <div
            class="thead"
            aria-hidden="true"
          >
            <span>#</span><span>DATE</span><span>TYPE</span><span>TITLE</span>
          </div>
          <ul
            ref="list"
            class="plist"
            aria-label="Latest articles"
          >
            <li
              v-for="(item, i) in posts"
              :key="item.slug"
              class="rv"
              :class="{ pre: !shown }"
              :style="{ transitionDelay: `${(i * 0.08).toFixed(2)}s` }"
            >
              <NuxtLink
                class="row"
                :class="{ lock: i === current }"
                :to="`/blog/${item.slug}`"
                data-cursor="READ"
                @pointerenter="onEnter(i, $event)"
                @pointerleave="onLeave"
                @focus="select(i)"
              >
                <span class="n">{{ padNumber(i + 1, 2) }}</span>
                <time :datetime="item.publishedAt">{{ formatDate(item.publishedAt) }}</time>
                <span class="cat">{{ (item.category?.name ?? '').toUpperCase() }}</span>
                <span class="t">{{ item.title }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>
        <aside
          class="preview chamfer"
          aria-label="Selected article"
        >
          <span class="tl">PREVIEW</span>
          <b class="tt">{{ title }}</b>
          <span class="tc">{{ meta }}</span>
          <span class="tg">{{ tags }}</span>
        </aside>
      </div>
    </HomeContainer>
  </HomeWorld>
</template>

<style scoped>
.more {
  font: 400 11px/1 var(--f-px);
  letter-spacing: 0.12em;
  text-decoration: none;
  white-space: nowrap;
  padding: 6px 0;
}
.posts {
  display: grid;
  grid-template-columns: minmax(0, 1.9fr) minmax(0, 1fr);
  gap: 22px;
  align-items: start;
}
.files {
  background: rgba(8, 24, 26, 0.65);
  box-shadow: inset 0 0 0 1px rgba(92, 201, 190, 0.3);
  --c: 18px;
}
.files-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(92, 201, 190, 0.12);
  font: 400 11px/1 var(--f-px);
  letter-spacing: 0.1em;
  color: var(--aqua);
}
.files-bar i {
  font-style: normal;
  color: var(--dim);
}
.thead,
.row {
  display: grid;
  grid-template-columns: 2.4em 7em 7.6em minmax(0, 1fr);
  gap: 14px;
  align-items: center;
}
.thead {
  padding: 11px 16px;
  font: 400 10px/1 var(--f-px);
  letter-spacing: 0.12em;
  color: var(--dim);
  border-bottom: 1px dashed rgba(92, 201, 190, 0.22);
}
.plist {
  list-style: none;
  margin: 0;
  padding: 0;
}
.rv {
  clip-path: inset(0 0 0 0);
  transition:
    opacity 0.8s var(--ease),
    transform 1.1s var(--ease),
    clip-path 1s var(--ease);
}
.rv.pre {
  opacity: 0;
  transform: translateX(-16px);
  clip-path: inset(0 100% 0 0);
}
.row {
  position: relative;
  width: 100%;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(92, 201, 190, 0.1);
  color: #d6e6e2;
  text-decoration: none;
  font: 400 12.5px/1.5 var(--f-mono);
  transition:
    background-color 0.3s,
    color 0.3s,
    padding 0.5s var(--ease);
}
.row .n {
  color: var(--dim);
}
.row time {
  color: var(--aqua);
}
.row .cat {
  justify-self: start;
  font: 400 10px/1 var(--f-px);
  letter-spacing: 0.08em;
  padding: 4px 7px;
  box-shadow: inset 0 0 0 1px rgba(92, 201, 190, 0.4);
}
.row .t {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font: 500 14.5px/1.5 var(--f-ja);
}
.row.lock {
  background: var(--mustard);
  color: #18120f;
  padding-left: 24px;
}
.row.lock .n,
.row.lock time {
  color: #18120f;
}
.row.lock .cat {
  box-shadow: inset 0 0 0 1px #18120f;
}
.row.lock::before {
  content: '>';
  position: absolute;
  left: 8px;
  top: 50%;
  translate: 0 -50%;
  font: 700 12px var(--f-mono);
  color: #18120f;
  animation: cblink 1.1s steps(1, end) infinite;
}
.row:focus-visible {
  outline: 1px solid var(--ink);
  outline-offset: -1px;
}
.preview {
  position: sticky;
  top: calc(var(--head) + 24px);
  display: grid;
  gap: 10px;
  padding: 20px;
  background: var(--base);
  box-shadow: inset 0 0 0 1.5px var(--warm);
  --c: 18px;
}
.tl {
  justify-self: start;
  font: 400 10px/1 var(--f-px);
  letter-spacing: 0.14em;
  color: var(--base);
  background: var(--warm);
  padding: 5px 8px;
}
.tt {
  font: 700 17px/1.55 var(--f-ja);
  color: #fff;
}
.tc {
  font: 400 11px/1.5 var(--f-px);
  letter-spacing: 0.1em;
  color: var(--aqua);
}
.tg {
  font: 400 12.5px/1.7 var(--f-mono);
  color: var(--dim);
}
@keyframes cblink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.12;
  }
}
@media (max-width: 860px) {
  .posts {
    grid-template-columns: minmax(0, 1fr);
  }
  .preview {
    display: none;
  }
}
@media (max-width: 640px) {
  .thead {
    display: none;
  }
  .row {
    grid-template-columns: auto auto minmax(0, 1fr);
    row-gap: 4px;
  }
  .row .n {
    display: none;
  }
  .row .t {
    grid-column: 1 / -1;
    white-space: normal;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}
</style>
