<script setup lang="ts">
import type { CaseStudy } from '~/data/caseStudies'

/** Header of a case study page, in the same frame as an article header. */
defineProps<{ study: CaseStudy, readingMinutes: number }>()
</script>

<template>
  <header class="chead intro">
    <div class="aframe">
      <CircuitCanvas />
      <div class="chead-in">
        <p class="crumb">
          <NuxtLink to="/#works">&lt;works/&gt;</NuxtLink>
          <span>/</span>
          <span>CASE STUDY</span>
        </p>
        <h1 class="cname">
          {{ study.name }}
        </h1>
        <p class="ctitle">
          {{ study.title }}
        </p>
        <p class="lede">
          {{ study.lede }}
        </p>
        <dl class="facts">
          <div
            v-for="fact in study.facts"
            :key="fact.label"
          >
            <dt>{{ fact.label }}</dt>
            <dd>{{ fact.value }}</dd>
          </div>
        </dl>
        <p class="asof">
          AS OF {{ formatDate(study.asOf) }} · {{ readingMinutes }} MIN READ
        </p>
        <span class="links">
          <BracketButton
            label="SOURCE ↗"
            :to="study.source"
            cursor="GITHUB"
          />
        </span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.chead {
  padding: 18px max(18px, var(--gut-r)) 0 max(18px, var(--gut-l));
}
.aframe {
  position: relative;
  overflow: hidden;
  background: rgba(10, 24, 27, 0.6);
  box-shadow: inset 0 0 0 1.5px var(--warm);
  clip-path: polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 22px 100%, 0 calc(100% - 22px));
}
.aframe::before,
.aframe::after {
  content: '';
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
.chead-in {
  position: relative;
  z-index: 1;
  max-width: 1120px;
  margin: 0 auto;
  padding: clamp(40px, 6vw, 84px) clamp(24px, 5vw, 64px) clamp(28px, 4vw, 48px);
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 18px;
}
.crumb {
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
.crumb a:hover {
  color: var(--ink);
}
.cname {
  margin: 0;
  font-family: var(--f-wide);
  font-weight: 400;
  font-variation-settings:
    'wght' 800,
    'wdth' 130;
  font-size: clamp(56px, 10vw, 148px);
  line-height: 0.9;
  letter-spacing: -0.01em;
  overflow-wrap: anywhere;
}
.ctitle {
  margin: 0;
  max-width: 30em;
  font: 900 clamp(20px, 2.4vw, 32px) / 1.5 var(--f-ja);
  text-wrap: balance;
  word-break: auto-phrase;
}
.lede {
  margin: 0;
  max-width: 40em;
  font: 400 clamp(15px, 1.25vw, 17px) / 1.95 var(--f-ja);
  color: var(--dim);
}
.facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  margin: 8px 0 0;
  background: var(--line);
  box-shadow: inset 0 0 0 1px var(--line);
}
.facts div {
  display: grid;
  gap: 8px;
  padding: 14px 16px;
  background: rgba(10, 24, 27, 0.92);
}
.facts dt {
  font: 400 10px/1 var(--f-px);
  letter-spacing: 0.14em;
  color: var(--dim);
}
.facts dd {
  margin: 0;
  font: 500 15px/1.4 var(--f-sans);
  color: var(--ink);
  overflow-wrap: anywhere;
}
.asof {
  margin: 0;
  font: 400 10px/1 var(--f-px);
  letter-spacing: 0.14em;
  color: var(--dim);
}
.links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
/* load sequence, as on the article header */
.intro .aframe {
  animation: frame-in 0.9s var(--ease) both;
}
@keyframes frame-in {
  from {
    clip-path: polygon(0 0, 0 0, 0 0, 0 100%, 0 100%, 0 100%);
  }
}
.intro .crumb,
.intro .cname,
.intro .ctitle,
.intro .lede,
.intro .facts {
  animation: rise 0.8s var(--ease) both;
}
.intro .cname {
  animation-delay: 0.2s;
}
.intro .ctitle {
  animation-delay: 0.3s;
}
.intro .lede {
  animation-delay: 0.45s;
}
.intro .facts {
  animation-delay: 0.6s;
}
@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
}
@media (max-width: 640px) {
  .facts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
