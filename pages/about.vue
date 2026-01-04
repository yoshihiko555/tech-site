<template>
  <div class="about-page">
    <!-- Hero Section -->
    <section class="hero-section" ref="root">
      <div class="hero-content">
        <div class="hero-avatar">
          <div class="avatar-ring">
            <div class="avatar-inner">
              <span class="avatar-initial">Y</span>
            </div>
          </div>
        </div>
        <h1 class="hero-name">Yoshihiko</h1>
        <p class="hero-title">
          <span class="title-bracket">&lt;</span>
          <span class="title-text">Engineer</span>
          <span class="title-bracket">/&gt;</span>
        </p>
        <div class="hero-decoration">
          <span class="decoration-line"></span>
          <span class="decoration-dot"></span>
          <span class="decoration-line"></span>
        </div>
      </div>
    </section>

    <!-- Career Section -->
    <section class="content-section career-section">
      <div class="section-header">
        <span class="section-number">01</span>
        <h2 class="section-title">Career</h2>
      </div>
      <div class="career-timeline">
        <div class="timeline-item" v-for="(item, index) in careerItems" :key="index">
          <div class="timeline-marker">
            <div class="marker-dot"></div>
            <div class="marker-line" v-if="index < careerItems.length - 1"></div>
          </div>
          <div class="timeline-content">
            <span class="timeline-year">{{ item.year }}</span>
            <p class="timeline-text">{{ item.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    <section class="content-section skills-section">
      <div class="section-header">
        <span class="section-number">02</span>
        <h2 class="section-title">Skills</h2>
      </div>
      <skill-list :skills="skills" />
    </section>

    <!-- Background Decoration -->
    <div class="bg-decoration">
      <div class="bg-grid"></div>
      <div class="bg-gradient"></div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from '@nuxtjs/composition-api'
import SkillList from '~/components/molecules/skill-list.vue'
import { SKILLS, SkillType } from '~/utils/const'

type CareerItem = {
  year: string
  text: string
}

type Data = {
  skills: SkillType[]
  careerItems: CareerItem[]
}

export default defineComponent({
  components: {
    SkillList
  },
  head: {
    title: 'About',
    meta: [
      { hid: 'description', name: 'description', content: 'yoshihiko about page' },
      { hid: 'og:title', property: 'og:title', content: 'About | Yoshihiko' },
      { hid: 'og:description', property: 'og:description', content: 'yoshihiko about page' },
      { hid: 'og:url', property: 'og:url', content: `${process.env.ORIGIN}/about` || 'http://localhost:3000/about' },
      { hid: 'twitter:title', property: 'twitter:title', content: 'About | Yoshihiko' },
      { hid: 'twitter:description', property: 'twitter:description', content: 'yoshihiko about page' },
    ]
  },
  setup (): Data {
    const careerItems: CareerItem[] = [
      { year: '1994', text: '栃木県に生まれる' },
      { year: '2015', text: '専門学校卒業後、業界の技術職として従事' },
      { year: '2019', text: '某IT会社に転職、エンジニアとしてキャリアをスタート' },
    ]

    return {
      skills: SKILLS,
      careerItems,
    }
  }
})
</script>

<style lang="postcss" scoped>
  /* ========================================
     About Page - Refined Tech Style
     ======================================== */

  .about-page {
    @apply relative pb-20;
    overflow: hidden;
  }

  /* Hero Section */
  .hero-section {
    @apply relative text-center py-16 md:py-24;
  }

  .hero-content {
    @apply relative z-10;
    animation: fadeInUp 0.8s ease-out;
  }

  .hero-avatar {
    @apply mb-6;
  }

  .avatar-ring {
    @apply inline-flex items-center justify-center w-28 h-28 md:w-36 md:h-36 rounded-full;
    background: linear-gradient(135deg, #90A4AE 0%, #546E7A 50%, #263238 100%);
    padding: 3px;
    animation: pulse-ring 3s ease-in-out infinite;
  }

  .avatar-inner {
    @apply w-full h-full rounded-full flex items-center justify-center;
    @apply bg-white dark:bg-site-black-back;
  }

  .avatar-initial {
    @apply text-4xl md:text-5xl font-bold tracking-tighter;
    @apply text-site-theme dark:text-site-theme-light;
    font-family: 'Inconsolata', monospace;
  }

  .hero-name {
    @apply text-4xl md:text-5xl font-bold tracking-wider mb-3;
    @apply text-site-black dark:text-white;
    letter-spacing: 0.2em;
  }

  .hero-title {
    @apply text-lg md:text-xl mb-6 flex items-center justify-center gap-2;
  }

  .title-bracket {
    @apply text-site-theme-light dark:text-site-theme font-mono;
    animation: blink 2s ease-in-out infinite;
  }

  .title-text {
    @apply text-site-theme dark:text-site-theme-light tracking-widest;
  }

  .hero-decoration {
    @apply flex items-center justify-center gap-3;
  }

  .decoration-line {
    @apply w-12 md:w-20 h-px;
    background: linear-gradient(90deg, transparent, currentColor, transparent);
    @apply text-site-theme-light dark:text-site-theme;
  }

  .decoration-dot {
    @apply w-2 h-2 rounded-full;
    @apply bg-site-theme dark:bg-site-theme-light;
  }

  /* Content Sections */
  .content-section {
    @apply relative mb-16;
    animation: fadeInUp 0.8s ease-out;
    animation-fill-mode: both;
  }

  .career-section {
    animation-delay: 0.2s;
  }

  .skills-section {
    animation-delay: 0.4s;
  }

  .section-header {
    @apply flex items-baseline gap-4 mb-8;
  }

  .section-number {
    @apply text-sm font-mono;
    @apply text-site-theme-light dark:text-site-theme;
  }

  .section-title {
    @apply text-2xl font-bold tracking-wider;
    @apply text-site-black dark:text-white;
    position: relative;
  }

  .section-title::after {
    content: '';
    @apply absolute left-0 -bottom-2 w-8 h-0.5;
    @apply bg-site-theme dark:bg-site-theme-light;
  }

  /* Career Timeline */
  .career-timeline {
    @apply pl-4 md:pl-8;
  }

  .timeline-item {
    @apply flex gap-4 md:gap-6;
    animation: slideInLeft 0.6s ease-out;
    animation-fill-mode: both;
  }

  .timeline-item:nth-child(1) { animation-delay: 0.3s; }
  .timeline-item:nth-child(2) { animation-delay: 0.4s; }
  .timeline-item:nth-child(3) { animation-delay: 0.5s; }

  .timeline-marker {
    @apply flex flex-col items-center;
  }

  .marker-dot {
    @apply w-3 h-3 rounded-full border-2 flex-shrink-0;
    @apply border-site-theme dark:border-site-theme-light;
    @apply bg-white dark:bg-site-black-back;
    transition: all 0.3s ease;
  }

  .timeline-item:hover .marker-dot {
    @apply bg-site-theme dark:bg-site-theme-light;
    transform: scale(1.2);
  }

  .marker-line {
    @apply w-px flex-grow;
    min-height: 2rem;
    background-color: rgba(144, 164, 174, 0.4);
  }

  .dark .marker-line {
    background-color: rgba(84, 110, 122, 0.4);
  }

  .timeline-content {
    @apply pb-8;
  }

  .timeline-year {
    @apply inline-block text-xs font-mono px-2 py-1 rounded mb-2;
    @apply text-site-theme dark:text-site-theme-light;
    background-color: rgba(144, 164, 174, 0.2);
  }

  .dark .timeline-year {
    background-color: rgba(84, 110, 122, 0.2);
  }

  .timeline-text {
    @apply text-sm md:text-base tracking-wide;
    color: rgba(51, 51, 51, 0.8);
  }

  .dark .timeline-text {
    color: rgba(255, 255, 255, 0.8);
  }

  /* Background Decorations */
  .bg-decoration {
    @apply absolute inset-0 pointer-events-none overflow-hidden;
    z-index: -1;
  }

  .bg-grid {
    @apply absolute inset-0;
    opacity: 0.05;
    background-image:
      linear-gradient(rgba(84, 110, 122, 0.3) 1px, transparent 1px),
      linear-gradient(90deg, rgba(84, 110, 122, 0.3) 1px, transparent 1px);
    background-size: 50px 50px;
    mask-image: radial-gradient(ellipse 60% 60% at 50% 0%, black 0%, transparent 70%);
    -webkit-mask-image: radial-gradient(ellipse 60% 60% at 50% 0%, black 0%, transparent 70%);
  }

  .dark .bg-grid {
    opacity: 0.1;
  }

  .bg-gradient {
    @apply absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-96;
    background: radial-gradient(ellipse at center top, rgba(144, 164, 174, 0.1) 0%, transparent 60%);
  }

  /* Keyframes */
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

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes pulse-ring {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(84, 110, 122, 0.4);
    }
    50% {
      box-shadow: 0 0 0 10px rgba(84, 110, 122, 0);
    }
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
</style>
