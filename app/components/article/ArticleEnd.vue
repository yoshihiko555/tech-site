<script setup lang="ts">
import type { PostDetail } from '#shared/types/post'

const props = defineProps<{ post: PostDetail }>()

const { origin } = useRuntimeConfig().public
const shareUrl = computed(() =>
  `https://twitter.com/intent/tweet?text=${encodeURIComponent(props.post.title)}&url=${encodeURIComponent(`${origin}/blog/${props.post.slug}`)}`,
)
const tagSlugs = computed(() => new Set(props.post.tags.map(tag => tag.slug)))

/** what links a related post to this one: a shared tag, otherwise the category */
function sharedLabel(item: PostDetail['related'][number]): string {
  const tag = item.tags.find(t => tagSlugs.value.has(t.slug))
  return tag ? `#${tag.name}` : item.category?.name.toUpperCase() ?? ''
}
</script>

<template>
  <section
    class="aend"
    aria-label="After the article"
  >
    <div class="aend-in">
      <div class="finish">
        <span>END OF FILE / {{ formatDate(post.publishedAt) }}</span>
        <a
          class="btn"
          :href="shareUrl"
          target="_blank"
          rel="noopener"
          data-cursor="SHARE"
        >[ SHARE ON X ]</a>
        <a
          class="btn warm"
          href="#top"
          data-cursor="TOP"
        >[ BACK TO TOP ]</a>
      </div>
      <nav
        v-if="post.older || post.newer"
        class="pn"
        aria-label="Older and newer posts"
      >
        <NuxtLink
          v-if="post.older"
          class="prev"
          :to="`/blog/${post.older.slug}`"
          data-cursor="READ"
        >
          <span class="lab">← OLDER</span>
          <span class="t">{{ post.older.title }}</span>
          <time :datetime="post.older.publishedAt">{{ formatDate(post.older.publishedAt) }}</time>
        </NuxtLink>
        <span v-else />
        <NuxtLink
          v-if="post.newer"
          class="next"
          :to="`/blog/${post.newer.slug}`"
          data-cursor="READ"
        >
          <span class="lab">NEWER →</span>
          <span class="t">{{ post.newer.title }}</span>
          <time :datetime="post.newer.publishedAt">{{ formatDate(post.newer.publishedAt) }}</time>
        </NuxtLink>
      </nav>
      <div
        v-if="post.related.length"
        class="rel"
      >
        <h2>[ RELATED POSTS ]</h2>
        <ol>
          <li
            v-for="item in post.related"
            :key="item.slug"
          >
            <NuxtLink
              :to="`/blog/${item.slug}`"
              data-cursor="READ"
            >
              <time :datetime="item.publishedAt">{{ formatDate(item.publishedAt) }}</time>
              <span>{{ item.title }}</span>
              <em>{{ sharedLabel(item) }}</em>
            </NuxtLink>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<style scoped>
.aend {
  max-width: 1180px;
  margin: 0 auto;
  padding-left: var(--gut-l);
  padding-right: var(--gut-r);
  padding-block: 8px 80px;
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr);
  gap: 56px;
}
.aend-in {
  grid-column: 2;
  min-width: 0;
  max-width: 38em;
  display: grid;
  gap: 34px;
}
.finish {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px 18px;
  padding: 20px 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  font: 400 11px/1 var(--f-px);
  letter-spacing: 0.14em;
  color: var(--dim);
}
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 14px;
  font: 400 11px/1 var(--f-px);
  letter-spacing: 0.14em;
  text-decoration: none;
  color: var(--ink);
  box-shadow: inset 0 0 0 1px var(--aqua);
  transition:
    background 0.2s,
    color 0.2s;
}
.btn:hover {
  background: var(--aqua);
  color: var(--base);
}
.btn.warm {
  box-shadow: inset 0 0 0 1px var(--warm);
}
.btn.warm:hover {
  background: var(--warm);
}
.finish .btn {
  margin-left: auto;
}
.pn {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2px;
}
.pn a {
  display: grid;
  gap: 10px;
  align-content: start;
  padding: 18px 20px 20px;
  text-decoration: none;
  background: var(--base-2);
  transition: background 0.2s;
}
.pn a:hover {
  background: var(--deep);
}
.pn .lab {
  font: 400 10px/1 var(--f-px);
  letter-spacing: 0.14em;
  color: var(--warm);
}
.pn .next {
  text-align: right;
}
.pn .t {
  font: 700 15px/1.7 var(--f-ja);
}
.pn time {
  font: 400 11px/1 var(--f-mono);
  color: var(--dim);
}
.rel h2 {
  margin: 0 0 12px;
  font: 400 11px/1 var(--f-px);
  letter-spacing: 0.14em;
  color: var(--warm);
}
.rel ol {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 2px;
}
.rel a {
  display: grid;
  grid-template-columns: 7.2em minmax(0, 1fr) auto;
  gap: 14px;
  align-items: baseline;
  padding: 12px 14px;
  text-decoration: none;
  background: rgba(238, 231, 218, 0.04);
  transition: background 0.2s;
}
.rel a:hover {
  background: rgba(92, 201, 190, 0.12);
}
.rel time {
  font: 400 11px/1.6 var(--f-mono);
  color: var(--dim);
}
.rel span {
  font: 500 14.5px/1.7 var(--f-ja);
}
.rel em {
  font: normal 400 10px/1 var(--f-px);
  letter-spacing: 0.12em;
  color: var(--aqua);
  white-space: nowrap;
}
@media (max-width: 980px) {
  .aend {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
  }
  .aend-in {
    grid-column: 1;
  }
}
@media (max-width: 640px) {
  .pn {
    grid-template-columns: minmax(0, 1fr);
  }
  .pn .next {
    text-align: left;
  }
  .rel a {
    grid-template-columns: minmax(0, 1fr);
    gap: 4px;
  }
}
</style>
