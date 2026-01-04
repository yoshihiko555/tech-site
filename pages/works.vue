<template>
  <div class="works-page">
    <!-- Page Header -->
    <header class="page-header">
      <div class="header-content">
        <span class="section-label">Portfolio</span>
        <h1 class="page-title">Works</h1>
        <p class="page-description">
          <span class="code-style">&lt;</span>
          Projects I've built
          <span class="code-style">/&gt;</span>
        </p>
        <div class="header-decoration">
          <span class="decoration-line"></span>
          <span class="decoration-icon">
            <i class="bx bx-code-alt"></i>
          </span>
          <span class="decoration-line"></span>
        </div>
      </div>
    </header>

    <!-- Works Grid -->
    <div class="works-grid">
      <div
        v-for="(work, index) in works"
        :key="work.name"
        class="work-item"
        :style="{ '--delay': index * 0.1 + 's' }"
      >
        <work-card :siteUrl="work.siteUrl" :sourceUrl="work.sourceUrl">
          <template #image>
            <img :src="work.img" :alt="work.name" />
          </template>
          <template #icon>
            <i class="bx" :class="work.sourceIcon" />
          </template>
          <template #title>
            {{ work.name }}
          </template>
          <template #description>
            {{ work.description }}
          </template>
        </work-card>
      </div>
    </div>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-value">{{ works.length }}</span>
          <span class="stat-label">Projects</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">100%</span>
          <span class="stat-label">Passion</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-value">∞</span>
          <span class="stat-label">Learning</span>
        </div>
      </div>
    </section>

    <!-- Background Decoration -->
    <div class="bg-decoration">
      <div class="bg-grid"></div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from '@nuxtjs/composition-api'
import WorkCard from '~/components/atoms/work-card.vue'
import { WORKS, WorkType } from '~/utils/const'
type Data = {
  works: WorkType[]
}
export default defineComponent({
  components: {
    WorkCard,
  },
  head: {
    title: 'Works',
    meta: [
      { hid: 'description', name: 'description', content: 'yoshihiko works page' },
      { hid: 'og:title', property: 'og:title', content: 'Works | Yoshihiko' },
      { hid: 'og:description', property: 'og:description', content: 'yoshihiko works page' },
      { hid: 'og:url', property: 'og:url', content: `${process.env.ORIGIN}/works` || 'http://localhost:3000/works' },
      { hid: 'twitter:title', property: 'twitter:title', content: 'Works | Yoshihiko' },
      { hid: 'twitter:description', property: 'twitter:description', content: 'yoshihiko works page' },
    ]
  },
  setup (): Data {
    return {
      works: WORKS,
    }
  }
})
</script>

<style lang="scss" scoped>
/* ========================================
   Works Page - Portfolio Showcase
   ======================================== */

.works-page {
  @apply relative pb-16;
  overflow: hidden;
}

/* Page Header */
.page-header {
  @apply text-center py-12 md:py-16 mb-8;
  animation: fadeInDown 0.6s ease-out;
}

.header-content {
  @apply relative z-10;
}

.section-label {
  @apply inline-block text-xs font-mono uppercase tracking-widest px-3 py-1 rounded mb-4;
  @apply text-site-theme dark:text-site-theme-light;
  background-color: rgba(84, 110, 122, 0.1);
}

.dark .section-label {
  background-color: rgba(144, 164, 174, 0.1);
}

.page-title {
  @apply text-4xl md:text-5xl font-bold tracking-wider mb-4;
  @apply text-site-black dark:text-white;
  letter-spacing: 0.15em;
}

.page-description {
  @apply text-base md:text-lg mb-6;
  color: rgba(51, 51, 51, 0.7);
}

.dark .page-description {
  color: rgba(255, 255, 255, 0.7);
}

.code-style {
  @apply font-mono;
  @apply text-site-theme-light dark:text-site-theme;
}

.header-decoration {
  @apply flex items-center justify-center gap-4;
}

.decoration-line {
  @apply w-12 md:w-20 h-px;
  background: linear-gradient(90deg, transparent, currentColor, transparent);
  @apply text-site-theme-light dark:text-site-theme;
}

.decoration-icon {
  @apply w-10 h-10 rounded-full flex items-center justify-center text-lg;
  @apply border-2 border-site-theme dark:border-site-theme-light;
  @apply text-site-theme dark:text-site-theme-light;
}

/* Works Grid */
.works-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8;
  @apply px-0;
}

.work-item {
  animation: fadeInUp 0.6s ease-out forwards;
  animation-delay: var(--delay, 0s);
  opacity: 0;
}

/* Stats Section */
.stats-section {
  @apply py-16 mt-12;
}

.stats-grid {
  @apply flex items-center justify-center gap-6 md:gap-12 flex-wrap;
}

.stat-item {
  @apply text-center px-4;
  animation: fadeInUp 0.6s ease-out;
  animation-delay: 0.4s;
  animation-fill-mode: both;
}

.stat-value {
  @apply block text-3xl md:text-4xl font-bold mb-1;
  background: linear-gradient(135deg, #546E7A 0%, #90A4AE 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  @apply text-sm font-mono uppercase tracking-wider;
  color: rgba(51, 51, 51, 0.6);
}

.dark .stat-label {
  color: rgba(255, 255, 255, 0.6);
}

.stat-divider {
  @apply hidden md:block w-px h-12;
  background: linear-gradient(180deg, transparent, currentColor, transparent);
  @apply text-site-theme-light dark:text-site-theme;
}

/* Background Decoration */
.bg-decoration {
  @apply absolute inset-0 pointer-events-none overflow-hidden;
  z-index: -1;
}

.bg-grid {
  @apply absolute inset-0;
  opacity: 0.03;
  background-image:
    linear-gradient(rgba(84, 110, 122, 0.3) 1px, transparent 1px),
    linear-gradient(90deg, rgba(84, 110, 122, 0.3) 1px, transparent 1px);
  background-size: 50px 50px;
  mask-image: radial-gradient(ellipse 80% 50% at 50% 100%, black 0%, transparent 70%);
  -webkit-mask-image: radial-gradient(ellipse 80% 50% at 50% 100%, black 0%, transparent 70%);
}

.dark .bg-grid {
  opacity: 0.08;
}

/* Keyframes */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
