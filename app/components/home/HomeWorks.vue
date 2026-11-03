<script setup lang="ts">
import { LINKS } from '~/data/profile'
import { isSideProject, WORKS } from '~/data/works'

/** WORKS: the pastel world with the inventory list and a card for the selected item. */
const list = ref<HTMLElement | null>(null)
const card = ref<HTMLElement | null>(null)
const shot = ref<HTMLElement | null>(null)
const shown = useReveal(list)
const current = ref(0)
const work = computed(() => WORKS[current.value]!)
const name = useScrambleText(() => work.value.name.toUpperCase())
const label = computed(
  () => `ITEM ${padNumber(current.value + 1, 2)}${isSideProject(work.value) ? ' / SIDE PROJECT' : ''}`,
)
const caption = computed(() => work.value.image.split('/').pop()!.toUpperCase())
/** longer names get a smaller size so they fit the card */
const fit = ref('60px')

function measure() {
  if (!card.value) return
  const room = card.value.clientWidth - 48
  fit.value = `${Math.max(26, Math.floor(room / (work.value.name.length * 0.98)))}px`
}

function select(i: number) {
  if (i === current.value) return
  current.value = i
  measure()
  replayClass(shot.value, 'swap', 420)
}

onMounted(() => {
  measure()
  // warm the cache so switching items shows the screenshot at once
  WORKS.forEach((item) => {
    new Image().src = item.image
  })
  window.addEventListener('resize', measure)
})
onBeforeUnmount(() => window.removeEventListener('resize', measure))
</script>

<template>
  <HomeWorld
    id="works"
    tone="pastel"
    texture
    data-tag="<works/>"
    data-nav="works"
    aria-labelledby="works-h"
  >
    <HomeContainer>
      <SectionHead
        id="works-h"
        title="WORKS"
        :meta="`INVENTORY ${padNumber(WORKS.length, 2)}`"
        variant="tiles"
      >
        <a
          class="more hov"
          :href="LINKS.github"
          target="_blank"
          rel="noopener"
          data-cursor="GITHUB"
        ><RollText text="MORE ON GITHUB ↗" /></a>
      </SectionHead>
      <div class="wgrid">
        <ul
          ref="list"
          class="wlist chamfer"
          aria-label="Works"
        >
          <li
            v-for="(item, i) in WORKS"
            :key="item.name"
            class="rv"
            :class="{ pre: !shown }"
            :style="{ transitionDelay: `${(i * 0.08).toFixed(2)}s` }"
          >
            <button
              type="button"
              class="witem"
              :class="{ on: i === current }"
              data-cursor="VIEW"
              :aria-pressed="i === current"
              @pointerenter="select(i)"
              @focus="select(i)"
              @click="select(i)"
            >
              <span class="wn">{{ padNumber(i + 1, 2) }}</span><b>{{ item.name }}</b><span>{{ item.description.split(' ')[0] }}</span>
            </button>
          </li>
        </ul>
        <article
          ref="card"
          class="wcard chamfer"
          aria-live="polite"
        >
          <span class="no">{{ label }}</span>
          <h3 :style="{ '--wfit': fit }">
            <span class="sr-only">{{ work.name }}</span><span aria-hidden="true">{{ name }}</span>
          </h3>
          <p>{{ work.description }}</p>
          <span
            v-if="work.stack.length"
            class="chips"
          ><span
            v-for="item in work.stack"
            :key="item"
          >{{ item }}</span></span>
          <figure
            ref="shot"
            class="wshot"
          >
            <img
              :src="work.image"
              :alt="`${work.name} screenshot`"
              width="1200"
              height="750"
            >
            <figcaption>{{ caption }}</figcaption>
          </figure>
          <span class="wlinks">
            <BracketButton
              v-if="work.site"
              label="OPEN SITE ↗"
              :to="work.site"
              cursor="OPEN"
            />
            <BracketButton
              v-if="work.source"
              label="SOURCE ↗"
              :to="work.source"
              cursor="GITHUB"
            />
          </span>
        </article>
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
.wgrid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  gap: 22px;
  align-items: start;
}
.wlist {
  list-style: none;
  margin: 0;
  padding: 10px;
  background: rgba(16, 32, 31, 0.06);
  box-shadow: inset 0 0 0 1.5px #10201f;
  --c: 16px;
}
.rv {
  transition:
    opacity 0.8s var(--ease),
    transform 1.1s var(--ease);
}
.rv.pre {
  opacity: 0;
  transform: translateY(16px);
}
.witem {
  all: unset;
  box-sizing: border-box;
  width: 100%;
  display: grid;
  grid-template-columns: 3.4em minmax(0, 1fr) auto;
  gap: 10px;
  align-items: baseline;
  padding: 12px;
  cursor: pointer;
  color: #10201f;
  transition:
    background-color 0.3s,
    color 0.3s,
    padding 0.5s var(--ease);
}
.wn {
  font: 400 11px/1 var(--f-px);
  letter-spacing: 0.08em;
  opacity: 0.7;
}
.witem b {
  font: 600 17px/1.2 var(--f-sans);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.witem span:last-child {
  font: 400 12px/1.3 var(--f-mono);
  opacity: 0.75;
}
.witem.on {
  background: #10201f;
  color: #f6efe3;
  padding-left: 18px;
}
.witem:focus-visible {
  outline: 1.5px solid #10201f;
  outline-offset: 2px;
}
.wcard {
  position: sticky;
  top: calc(var(--head) + 24px);
  display: grid;
  gap: 14px;
  align-content: start;
  min-height: 320px;
  padding: 24px;
  background: var(--base);
  color: var(--ink);
  --c: 20px;
}
.no {
  font: 400 11px/1 var(--f-px);
  letter-spacing: 0.12em;
  color: var(--mustard);
}
.wcard h3 {
  margin: 0;
  font-family: var(--f-wide);
  font-weight: 400;
  font-variation-settings:
    'wght' 500,
    'wdth' 135;
  font-size: min(clamp(34px, 4.4vw, 60px), var(--wfit, 60px));
  line-height: 1;
  letter-spacing: 0.06em;
  white-space: nowrap;
  color: var(--ink);
  text-shadow:
    0 0 8px rgba(238, 231, 218, 0.35),
    0 0 24px rgba(92, 201, 190, 0.18);
}
.wcard p {
  margin: 0;
  font: 500 16px/1.6 var(--f-sans);
  color: #d6e6e2;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.chips span {
  font: 400 10px/1 var(--f-px);
  letter-spacing: 0.08em;
  padding: 5px 7px;
  color: var(--aqua);
  box-shadow: inset 0 0 0 1px rgba(92, 201, 190, 0.45);
}
/* screenshot in a small screen frame: the whole image, uncropped and without scanlines
   (shots range from square to twice as wide as tall) */
.wshot {
  position: relative;
  margin: 4px 0 0;
  overflow: hidden;
  aspect-ratio: 16 / 10;
  max-width: 100%;
  background: #0a1719;
  box-shadow: inset 0 0 0 1px rgba(92, 201, 190, 0.35);
  clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%);
}
.wshot img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.wshot figcaption {
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 1;
  padding: 5px 8px;
  font: 400 9px/1 var(--f-px);
  letter-spacing: 0.12em;
  color: var(--base);
  background: var(--aqua);
}
.wshot.swap img {
  animation: shotin 0.42s steps(6) both;
}
@keyframes shotin {
  0% {
    clip-path: inset(0 0 100% 0);
    filter: hue-rotate(90deg) brightness(1.6);
    transform: translateX(-6px);
  }
  40% {
    clip-path: inset(0 0 40% 0);
    transform: translateX(4px);
  }
  70% {
    clip-path: inset(0 0 8% 0);
    filter: none;
    transform: translateX(-2px);
  }
  100% {
    clip-path: inset(0 0 0 0);
    transform: none;
  }
}
.wlinks {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
@media (max-width: 980px) {
  .wgrid {
    grid-template-columns: minmax(0, 1fr);
  }
  .wcard {
    position: relative;
    top: auto;
  }
}
</style>
