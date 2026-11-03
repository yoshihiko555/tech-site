<script setup lang="ts">
import { BIO, PERKS, PROFILE, SINCE, STACK, TRAITS } from '~/data/profile'
import { isSideProject, WORKS } from '~/data/works'

/** STATUS: the warm grain world with the bio, the stack chips and the PLAYER card. */
const props = defineProps<{ postCount: number }>()

const years = yearsSince(SINCE, useBuildYear().value)
const sideProjects = WORKS.filter(isSideProject).length
const facts = computed(() => [`${years} YEARS`, `${sideProjects} SIDE PROJECTS`, `${props.postCount} POSTS`])
const chips = STACK.flatMap((group) => group.items)

const grid = ref<HTMLElement | null>(null)
const level = ref(years)
/** stack chips shown so far (they fill in one by one on first view) */
const chipsShown = ref(chips.length)
const timers: ReturnType<typeof setTimeout>[] = []

const shown = useReveal(grid, () => {
  if (motionReduced()) return
  chips.forEach((_, i) => timers.push(setTimeout(() => (chipsShown.value = i + 1), i * 45)))
  let n = 0
  const count = () => {
    level.value = ++n
    if (n < years) timers.push(setTimeout(count, 80))
  }
  count()
})

/** position of a chip across all groups */
function chipIndex(group: number, i: number): number {
  return STACK.slice(0, group).reduce((sum, g) => sum + g.items.length, 0) + i
}

onMounted(() => {
  if (!motionReduced()) chipsShown.value = 0
})
onBeforeUnmount(() => timers.forEach(clearTimeout))
</script>

<template>
  <HomeWorld
    id="status"
    tone="warm"
    texture
    data-tag="<status/>"
    data-nav="status"
    aria-labelledby="status-h"
  >
    <template #back>
      <GrainField kind="warm" />
    </template>
    <HomeContainer>
      <SectionHead
        id="status-h"
        title="STATUS"
        meta="PLAYER 01"
      />
      <div
        ref="grid"
        class="status"
      >
        <div
          class="bio rv"
          :class="{ pre: !shown }"
        >
          <p class="online">
            <i aria-hidden="true" />ONLINE SINCE {{ SINCE }}
          </p>
          <p
            v-for="(paragraph, n) in BIO"
            :key="n"
            class="t"
          >
            <template
              v-for="(part, i) in paragraph"
              :key="i"
            >
              <mark v-if="part.mark">{{ part.text }}</mark>
              <template v-else>
                {{ part.text }}
              </template>
            </template>
          </p>
          <div class="facts">
            <span
              v-for="fact in facts"
              :key="fact"
            >{{ fact }}</span>
          </div>
          <div class="yellow chamfer">
            <div
              class="vtab"
              aria-hidden="true"
            >
              ★<span>&lt;stack/&gt;</span>
            </div>
            <h3>[ STACK ]</h3>
            <div class="stack">
              <div
                v-for="(group, g) in STACK"
                :key="group.group"
              >
                <h4>{{ group.group }}</h4>
                <ul>
                  <li
                    v-for="(item, i) in group.items"
                    :key="item"
                    :class="{ pre: chipIndex(g, i) >= chipsShown }"
                  >
                    {{ item }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="side">
          <article
            class="dark chamfer rv"
            :class="{ pre: !shown }"
            style="transition-delay: 0.08s"
            data-cursor="HELLO"
          >
            <h3>[ PLAYER ]</h3>
            <div class="player">
              <div class="ava">
                <img
                  src="/avatar.png"
                  :alt="`${PROFILE.name}のアバター`"
                  width="1145"
                  height="1110"
                  loading="lazy"
                  decoding="async"
                >
              </div>
              <dl class="kv">
                <div>
                  <dt>NAME</dt>
                  <dd>{{ PROFILE.name }}</dd>
                </div>
                <div>
                  <dt>CLASS</dt>
                  <dd>{{ PROFILE.className }}</dd>
                </div>
                <div>
                  <dt>LEVEL</dt>
                  <dd><span class="lv">{{ level }}</span></dd>
                </div>
              </dl>
            </div>
            <p class="quest">
              <b>MAIN QUEST</b>{{ PROFILE.mainQuest }}
            </p>
          </article>
          <article
            class="dark chamfer rv"
            :class="{ pre: !shown }"
            style="transition-delay: 0.16s"
          >
            <div class="lists">
              <div>
                <h3>[ TRAITS ]</h3>
                <ul class="list">
                  <li
                    v-for="item in TRAITS"
                    :key="item"
                  >
                    {{ item }}
                  </li>
                </ul>
              </div>
              <div>
                <h3>[ PERKS ]</h3>
                <ul class="list perks">
                  <li
                    v-for="item in PERKS"
                    :key="item"
                  >
                    {{ item }}
                  </li>
                </ul>
              </div>
            </div>
          </article>
        </div>
      </div>
    </HomeContainer>
  </HomeWorld>
</template>

<style scoped>
.status {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 28px 48px;
  align-items: start;
}
.rv {
  transition:
    opacity 0.8s var(--ease),
    transform 1.1s var(--ease),
    filter 1s var(--ease);
}
.rv.pre {
  opacity: 0;
  transform: translateY(36px);
  filter: blur(6px);
}
.bio {
  display: grid;
  gap: 18px;
}
.online {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font: 400 11px/1 var(--f-px);
  letter-spacing: 0.12em;
}
.online i {
  width: 8px;
  height: 8px;
  background: #1c3b2c;
  box-shadow: 0 0 0 2px rgba(24, 18, 15, 0.25);
  animation: cblink 1.6s steps(1, end) infinite;
}
.t {
  margin: 0;
  font: 500 clamp(16px, 1.4vw, 19px)/1.75 var(--f-sans);
  max-width: 36em;
}
.t mark {
  background: var(--aqua);
  color: var(--base);
  padding: 0 0.25em;
}
.facts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.facts span {
  font: 400 11px/1 var(--f-px);
  letter-spacing: 0.1em;
  padding: 7px 9px;
  box-shadow: inset 0 0 0 1px rgba(24, 18, 15, 0.5);
}
.yellow {
  position: relative;
  margin-left: 34px;
  padding: 22px 22px 18px;
  background: var(--mustard);
  color: #18120f;
  --c: 18px;
}
.yellow h3,
.dark h3 {
  margin: 0 0 14px;
  font: 400 12px/1 var(--f-px);
  letter-spacing: 0.12em;
}
.vtab {
  position: absolute;
  left: -34px;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 10px 6px;
  background: var(--base);
  color: var(--mustard);
  font: 400 10px/1 var(--f-px);
  letter-spacing: 0.16em;
}
.vtab span {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}
.stack {
  display: grid;
  gap: 18px;
}
.stack > div + div {
  padding-top: 16px;
  border-top: 1px solid rgba(24, 18, 15, 0.2);
}
.stack h4 {
  margin: 0 0 10px;
  font: 400 10px/1.5 var(--f-px);
  letter-spacing: 0.14em;
}
.stack ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.stack li {
  padding: 6px 10px;
  font: 500 12.5px/1.4 var(--f-mono);
  background: rgba(24, 18, 15, 0.05);
  box-shadow: inset 0 0 0 1px rgba(24, 18, 15, 0.18);
  transition:
    transform 0.5s var(--ease),
    opacity 0.5s;
}
.stack li.pre {
  opacity: 0;
  transform: translateY(8px);
}
.side {
  display: grid;
  gap: 18px;
}
.dark {
  position: relative;
  padding: 20px;
  background: var(--base);
  color: var(--ink);
  --c: 18px;
}
.dark h3 {
  color: var(--mustard);
}
.player {
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  gap: 18px;
  align-items: center;
}
.ava {
  position: relative;
  isolation: isolate;
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  background: #fff;
  overflow: hidden;
}
.ava img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.ava::before,
.ava::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: url('/avatar.png') center / contain no-repeat;
  opacity: 0;
}
.ava::before {
  z-index: 1;
  background:
    linear-gradient(rgba(92, 201, 190, 0.18), rgba(92, 201, 190, 0.18)),
    url('/avatar.png') center / contain no-repeat;
  animation: avatar-slice-a 6s steps(1, end) infinite;
}
.ava::after {
  z-index: 2;
  animation: avatar-slice-b 6s steps(1, end) infinite;
}
@keyframes avatar-slice-a {
  0%, 100% {
    opacity: 0;
  }
  95% {
    opacity: 1;
    clip-path: inset(28% 0 70% 0);
    transform: translateX(-4px);
  }
  96.25% {
    clip-path: inset(52% 0 45% 0);
    transform: translateX(5px);
  }
  97.5% {
    clip-path: inset(36% 0 62% 0);
    transform: translateX(-3px);
  }
  98.75% {
    clip-path: inset(72% 0 26% 0);
    transform: translateX(3px);
  }
}
@keyframes avatar-slice-b {
  0%, 100% {
    opacity: 0;
  }
  95% {
    opacity: 0.9;
    clip-path: inset(61% 0 37% 0);
    transform: translateX(4px);
  }
  96.25% {
    clip-path: inset(33% 0 65% 0);
    transform: translateX(-3px);
  }
  97.5% {
    clip-path: inset(68% 0 29% 0);
    transform: translateX(3px);
  }
  98.75% {
    clip-path: inset(45% 0 53% 0);
    transform: translateX(-4px);
  }
}
.kv {
  display: grid;
  gap: 7px;
  margin: 0;
  font: 400 12px/1.3 var(--f-mono);
}
.kv div {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  border-bottom: 1px dashed rgba(238, 231, 218, 0.15);
  padding-bottom: 5px;
}
.kv dt {
  color: var(--dim);
}
.kv dd {
  margin: 0;
  text-align: right;
}
.lv {
  font-family: var(--f-wide);
  font-variation-settings:
    'wght' 600,
    'wdth' 130;
  font-size: 26px;
  line-height: 1;
  color: var(--aqua);
  text-shadow:
    0 0 6px rgba(92, 201, 190, 0.55),
    0 0 18px rgba(92, 201, 190, 0.25);
}
.quest {
  margin: 16px 0 0;
  padding: 10px 12px;
  box-shadow: inset 2px 0 0 var(--warm);
  background: rgba(220, 106, 53, 0.1);
  font: 400 12.5px/1.6 var(--f-mono);
}
.quest b {
  display: block;
  font: 400 10px/1 var(--f-px);
  letter-spacing: 0.14em;
  color: var(--warm);
  margin-bottom: 6px;
}
.lists {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 7px;
  font: 500 13.5px/1.45 var(--f-sans);
}
.list li {
  position: relative;
  padding-left: 16px;
}
.list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.5em;
  width: 6px;
  height: 6px;
  background: var(--aqua);
}
.list.perks li::before {
  background: var(--warm);
}
@keyframes cblink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.12;
  }
}
@media (max-width: 980px) {
  .status {
    grid-template-columns: minmax(0, 1fr);
  }
}
@media (max-width: 860px) {
  .lists {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 640px) {
  .player {
    grid-template-columns: 88px minmax(0, 1fr);
  }
  .yellow {
    margin-left: 0;
  }
  .vtab {
    display: none;
  }
}
</style>
