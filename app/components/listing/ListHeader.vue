<script setup lang="ts">
export interface Crumb {
  label: string
  to?: string
}

const props = defineProps<{
  crumbs: Crumb[]
  title: string
  count: number
  countLabel: string
}>()
const query = defineModel<string>('query', { default: '' })

const shownTitle = useScrambleText(() => props.title)
const japanese = computed(() => /[^ -~]/.test(props.title))
</script>

<template>
  <header class="lhead">
    <div class="lframe">
      <div class="lhead-in">
        <p class="crumb">
          <template
            v-for="(crumb, i) in crumbs"
            :key="i"
          >
            <span v-if="i > 0">/</span>
            <NuxtLink
              v-if="crumb.to"
              :to="crumb.to"
            >
              {{ crumb.label }}
            </NuxtLink>
            <span v-else>{{ crumb.label }}</span>
          </template>
        </p>
        <h1
          class="ltitle"
          :class="{ ja: japanese }"
          :aria-label="title"
        >
          <span aria-hidden="true">{{ shownTitle }}</span>
        </h1>
        <p class="lcount">
          <b>{{ count }}</b><span>{{ countLabel }}</span>
        </p>
        <form
          class="grep"
          role="search"
          @submit.prevent
        >
          <label for="grep-q">~/writing $ grep</label>
          <input
            id="grep-q"
            v-model="query"
            type="search"
            autocomplete="off"
            placeholder="title or tag"
          >
          <button
            v-if="query"
            type="button"
            @click="query = ''"
          >
            CLEAR
          </button>
        </form>
      </div>
    </div>
  </header>
</template>

<style scoped>
.lhead {
  padding: 18px max(18px, var(--gut-r)) 0 max(18px, var(--gut-l));
}
.lframe {
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
.lframe::before,
.lframe::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 6px;
  height: 64px;
  margin-top: -32px;
  background: var(--warm);
}
.lframe::before {
  left: 0;
}
.lframe::after {
  right: 0;
}
.lhead-in {
  max-width: 1180px;
  margin: 0 auto;
  padding: clamp(32px, 5vw, 64px) clamp(24px, 4vw, 56px) 26px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 18px 32px;
  align-items: end;
}
.crumb {
  grid-column: 1 / -1;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  font: 400 11px/1 var(--f-px);
  letter-spacing: 0.14em;
  color: var(--dim);
}
.crumb a {
  text-decoration: none;
  color: var(--aqua);
}
.ltitle {
  margin: 0;
  min-width: 0;
  font-family: var(--f-wide), var(--f-ja);
  font-variation-settings:
    "wght" 500,
    "wdth" 140;
  font-size: clamp(40px, 7.4vw, 112px);
  line-height: 0.95;
  letter-spacing: 0.06em;
  overflow-wrap: anywhere;
}
.ltitle.ja {
  font-family: var(--f-ja);
  font-weight: 900;
  letter-spacing: 0.02em;
}
.lcount {
  margin: 0;
  text-align: right;
  font: 400 11px/1.8 var(--f-px);
  letter-spacing: 0.14em;
  color: var(--dim);
}
.lcount b {
  display: block;
  font-family: var(--f-wide);
  font-weight: 300;
  font-size: clamp(40px, 5vw, 72px);
  line-height: 1;
  letter-spacing: 0;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}
.grep {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: rgba(13, 28, 31, 0.8);
  box-shadow: inset 0 0 0 1px var(--line);
  font: 400 13px/1 var(--f-mono);
  color: var(--aqua);
}
.grep label {
  white-space: nowrap;
}
.grep input {
  flex: 1;
  min-width: 0;
  padding: 4px 0;
  font: 500 15px/1.4 var(--f-ja);
  color: var(--ink);
  background: transparent;
  border: 0;
  outline: 0;
  caret-color: var(--warm);
}
.grep input::placeholder {
  color: rgba(159, 178, 174, 0.55);
}
.grep:focus-within {
  box-shadow: inset 0 0 0 1px var(--warm);
}
.grep button {
  padding: 6px 9px;
  font: 400 10px/1 var(--f-px);
  letter-spacing: 0.12em;
  color: var(--ink);
  background: transparent;
  border: 0;
  box-shadow: inset 0 0 0 1px var(--line);
  cursor: pointer;
}
@media (max-width: 760px) {
  .lhead-in {
    grid-template-columns: minmax(0, 1fr);
  }
  .lcount {
    text-align: left;
  }
}
@media (max-width: 640px) {
  .lhead {
    padding: 12px 12px 0;
  }
}
</style>
