<script setup lang="ts">
import type { PostDetail } from '#shared/types/post'

const props = defineProps<{
  post: PostDetail
  sections: number
  codeBlocks: number
}>()

const date = computed(() => formatDate(props.post.publishedAt))
</script>

<template>
  <header class="ahead intro">
    <div class="aframe">
      <CircuitCanvas />
      <div class="ahead-in">
        <p class="crumb">
          <NuxtLink to="/blog">&lt;writing/&gt;</NuxtLink>
          <template v-if="post.category">
            <span>/</span>
            <NuxtLink :to="`/categories/${post.category.slug}`">
              {{ post.category.name.toUpperCase() }}
            </NuxtLink>
          </template>
          <span>/</span>
          <span>{{ post.slug }}</span>
        </p>
        <h1 class="atitle">
          <span
            class="ln"
            style="--n: 0"
          >{{ post.title }}</span>
        </h1>
        <p
          v-if="post.description"
          class="lede"
        >
          {{ post.description }}
        </p>
        <ul class="meta">
          <li>PUBLISHED <b>{{ date }}</b></li>
          <li v-if="post.category">
            <span class="cat">{{ post.category.name.toUpperCase() }}</span>
          </li>
          <li><b>{{ post.readingMinutes }}</b> MIN READ</li>
          <li><b>{{ sections }}</b> SECTIONS</li>
          <li v-if="codeBlocks">
            <b>{{ codeBlocks }}</b> CODE BLOCKS
          </li>
        </ul>
        <ul
          v-if="post.tags.length"
          class="tags"
        >
          <li
            v-for="tag in post.tags"
            :key="tag.slug"
          >
            <NuxtLink
              :to="`/tags/${tag.slug}`"
              data-cursor="TAG"
            >
              #{{ tag.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<style scoped>
.ahead {
  padding: 18px max(18px, var(--gut-r)) 0 max(18px, var(--gut-l));
}
.aframe {
  position: relative;
  overflow: hidden;
  background: rgba(10, 24, 27, 0.6);
  box-shadow: inset 0 0 0 1.5px var(--warm);
  clip-path: polygon(
    0 0,
    calc(100% - 22px) 0,
    100% 22px,
    100% 100%,
    22px 100%,
    0 calc(100% - 22px)
  );
}
.aframe::before,
.aframe::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 6px;
  height: 80px;
  margin-top: -40px;
  background: var(--warm);
  z-index: 2;
}
.aframe::before {
  left: 0;
}
.aframe::after {
  right: 0;
}
.ahead-in {
  position: relative;
  z-index: 1;
  max-width: 1120px;
  margin: 0 auto;
  padding: clamp(40px, 6vw, 84px) clamp(24px, 5vw, 64px)
    clamp(28px, 4vw, 48px);
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 22px;
}
.crumb {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font: 400 11px/1 var(--f-px);
  letter-spacing: 0.14em;
  color: var(--dim);
  overflow-wrap: anywhere;
}
.crumb a {
  text-decoration: none;
  color: var(--aqua);
}
.crumb a:hover {
  color: var(--ink);
}
.atitle {
  margin: 0;
  max-width: 30em;
  font: 900 clamp(26px, 3.3vw, 46px) / 1.42 var(--f-ja);
  letter-spacing: 0.01em;
  text-wrap: balance;
  word-break: auto-phrase;
  line-break: strict;
}
.atitle .ln {
  display: block;
}
.lede {
  margin: 0;
  max-width: 40em;
  font: 400 clamp(15px, 1.25vw, 17px) / 1.95 var(--f-ja);
  color: var(--dim);
}
.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 22px;
  margin: 6px 0 0;
  padding: 16px 0 0;
  border-top: 1px solid var(--line);
  font: 400 11px/1 var(--f-px);
  letter-spacing: 0.14em;
  color: var(--dim);
  list-style: none;
}
.meta b {
  font-weight: 400;
  color: var(--ink);
}
.meta .cat {
  color: var(--base);
  background: var(--aqua);
  padding: 4px 6px;
  margin: -4px 0;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.tags a {
  display: block;
  padding: 6px 9px;
  font: 500 13px/1 var(--f-sans);
  text-decoration: none;
  box-shadow: inset 0 0 0 1px var(--line);
  color: var(--ink);
  transition:
    background 0.2s,
    color 0.2s;
}
.tags a:hover {
  background: var(--aqua);
  color: var(--base);
}
/* load sequence (the page's one orchestrated moment) */
.intro .aframe {
  animation: frame-in 0.9s var(--ease) both;
}
@keyframes frame-in {
  from {
    clip-path: polygon(0 0, 0 0, 0 0, 0 100%, 0 100%, 0 100%);
  }
}
.intro .crumb,
.intro .lede,
.intro .meta,
.intro .tags {
  animation: rise 0.8s var(--ease) both;
}
.intro .atitle .ln {
  animation: wipe 1s var(--ease) both;
  animation-delay: calc(0.25s + var(--n) * 0.12s);
}
.intro .crumb {
  animation-delay: 0.15s;
}
.intro .lede {
  animation-delay: 0.55s;
}
.intro .meta {
  animation-delay: 0.7s;
}
.intro .tags {
  animation-delay: 0.8s;
}
@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
}
@keyframes wipe {
  from {
    clip-path: inset(0 100% 0 0);
    transform: translateX(-12px);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}
@media (max-width: 640px) {
  .ahead {
    padding: 12px 12px 0;
  }
}
</style>
