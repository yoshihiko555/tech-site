<script setup lang="ts">
import { NOW, NOW_UPDATED, type NowItem } from '~/data/now'

/** NOW: what is in progress right now, as a short status board after EPISODES. */
const list = ref<HTMLElement | null>(null)
const shown = useReveal(list)

function isExternal(item: NowItem): boolean {
  return Boolean(item.link?.to.startsWith('http'))
}
</script>

<template>
  <section
    id="now"
    class="now"
    data-tag="<now/>"
    data-nav="episodes"
    data-dim="0.85"
    aria-labelledby="now-h"
  >
    <HomeContainer>
      <SectionHead
        id="now-h"
        title="NOW"
        :meta="`UPDATED ${formatDate(NOW_UPDATED)}`"
      />
      <ol
        ref="list"
        class="now-list"
      >
        <li
          v-for="(item, i) in NOW"
          :key="item.name"
          class="row rv"
          :class="{ pre: !shown }"
          :style="{ transitionDelay: `${(i * 0.08).toFixed(2)}s` }"
        >
          <span class="nn">{{ padNumber(i + 1, 2) }}</span>
          <span
            class="st"
            :class="`st-${item.state.toLowerCase()}`"
          >{{ item.state }}</span>
          <h3>{{ item.name }}</h3>
          <p>{{ item.text }}</p>
          <NuxtLink
            v-if="item.link"
            class="go hov"
            :to="item.link.to"
            :target="isExternal(item) ? '_blank' : undefined"
            :data-cursor="item.link.label"
          >
            <RollText :text="`${item.link.label} ${isExternal(item) ? '↗' : '→'}`" />
          </NuxtLink>
        </li>
      </ol>
    </HomeContainer>
  </section>
</template>

<style scoped>
.now {
  position: relative;
  scroll-margin-top: var(--head);
  color: var(--ink);
}
.now-list {
  margin: 0;
  padding: 0;
  list-style: none;
  border-bottom: 1px solid var(--line);
}
.row {
  display: grid;
  grid-template-columns: 2.4em 7.5em minmax(0, 17em) minmax(0, 1fr) 7em;
  gap: 8px 20px;
  align-items: baseline;
  padding: 22px 4px;
  border-top: 1px solid var(--line);
  transition:
    opacity 0.8s var(--ease),
    transform 1.1s var(--ease),
    filter 1s var(--ease),
    background 0.25s;
}
.row:hover {
  background: rgba(92, 201, 190, 0.05);
}
.rv.pre {
  opacity: 0;
  transform: translateY(28px);
  filter: blur(6px);
}
.nn {
  font: 400 11px/1 var(--f-px);
  letter-spacing: 0.12em;
  color: var(--dim);
}
.st {
  justify-self: start;
  padding: 4px 7px;
  font: 400 10px/1 var(--f-px);
  letter-spacing: 0.12em;
  color: var(--base);
  background: var(--aqua);
}
.st-building {
  background: var(--warm);
  animation: cblink 1.6s steps(1, end) infinite;
}
.st-shipped {
  background: var(--mustard);
}
.row h3 {
  margin: 0;
  font-family: var(--f-wide);
  font-weight: 400;
  font-variation-settings:
    'wght' 600,
    'wdth' 120;
  font-size: clamp(20px, 2.2vw, 28px);
  line-height: 1.1;
  letter-spacing: 0.01em;
  overflow-wrap: anywhere;
}
.row p {
  margin: 0;
  max-width: 40em;
  font: 500 15px/1.85 var(--f-ja);
  color: var(--read);
}
.go {
  justify-self: end;
  font: 400 11px/1 var(--f-px);
  letter-spacing: 0.12em;
  white-space: nowrap;
  text-decoration: none;
  color: var(--aqua);
  padding: 6px 0;
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
  .row {
    grid-template-columns: 2.4em auto minmax(0, 1fr);
    align-items: center;
  }
  .row h3 {
    grid-column: 3;
  }
  .row p {
    grid-column: 2 / -1;
  }
  .go {
    grid-column: 2 / -1;
    justify-self: start;
  }
}
@media (max-width: 640px) {
  .row {
    grid-template-columns: auto minmax(0, 1fr);
    padding: 18px 0;
    gap: 10px 12px;
  }
  .nn {
    display: none;
  }
  .row h3 {
    grid-column: 2;
  }
  .row p,
  .go {
    grid-column: 1 / -1;
  }
}
</style>
