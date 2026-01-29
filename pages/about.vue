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
          <span class="title-text">Engineer / Creator</span>
          <span class="title-bracket">/&gt;</span>
        </p>
        <div class="hero-decoration">
          <span class="decoration-line"></span>
          <span class="decoration-dot"></span>
          <span class="decoration-line"></span>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="content-section summary-section">
      <div class="section-header">
        <span class="section-number">01</span>
        <h2 class="section-title">Profile</h2>
      </div>
      <div class="summary-body">
        <p class="summary-text" v-for="(text, index) in summaryTexts" :key="index">{{ text }}</p>
      </div>
    </section>

    <!-- Interests Section -->
    <section class="content-section strengths-section">
      <div class="section-header">
        <span class="section-number">02</span>
        <h2 class="section-title">Interests</h2>
      </div>
      <div class="strength-grid">
        <div class="strength-card" v-for="(item, index) in strengthItems" :key="index">
          <h3 class="strength-title">{{ item.title }}</h3>
          <p class="strength-text">{{ item.text }}</p>
        </div>
      </div>
    </section>

    <!-- Career Section -->
    <section class="content-section career-section">
      <div class="section-header">
        <span class="section-number">03</span>
        <h2 class="section-title">Timeline</h2>
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
        <span class="section-number">04</span>
        <h2 class="section-title">Toolkit</h2>
      </div>
      <skill-list :skills="skills" />
    </section>

    <!-- Projects Section -->
    <section class="content-section projects-section">
      <div class="section-header">
        <span class="section-number">05</span>
        <h2 class="section-title">Side Projects</h2>
      </div>
      <div class="project-list">
        <div class="project-item" v-for="(project, index) in projectItems" :key="index">
          <div class="project-header">
            <h3 class="project-name">{{ project.name }}</h3>
            <span class="project-stack">{{ project.stack }}</span>
          </div>
          <p class="project-text">{{ project.text }}</p>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="content-section values-section">
      <div class="section-header">
        <span class="section-number">06</span>
        <h2 class="section-title">Values</h2>
      </div>
      <ul class="value-list">
        <li class="value-item" v-for="(item, index) in valueItems" :key="index">
          {{ item }}
        </li>
      </ul>
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

type StrengthItem = {
  title: string
  text: string
}

type ProjectItem = {
  name: string
  stack: string
  text: string
}

type Data = {
  skills: SkillType[]
  summaryTexts: string[]
  strengthItems: StrengthItem[]
  careerItems: CareerItem[]
  projectItems: ProjectItem[]
  valueItems: string[]
}

export default defineComponent({
  components: {
    SkillList
  },
  head: {
    title: 'About',
    meta: [
      { hid: 'description', name: 'description', content: '個人開発や技術への関心、これまでの歩みをまとめたプロフィール' },
      { hid: 'og:title', property: 'og:title', content: 'About | Yoshihiko' },
      { hid: 'og:description', property: 'og:description', content: '個人開発や技術への関心、これまでの歩みをまとめたプロフィール' },
      { hid: 'og:url', property: 'og:url', content: `${process.env.ORIGIN}/about` || 'http://localhost:3000/about' },
      { hid: 'twitter:title', property: 'twitter:title', content: 'About | Yoshihiko' },
      { hid: 'twitter:description', property: 'twitter:description', content: '個人開発や技術への関心、これまでの歩みをまとめたプロフィール' },
    ]
  },
  setup (): Data {
    const summaryTexts: string[] = [
      'フルスタック寄りの開発を軸に、気になる技術はまず触ってみるタイプです。',
      'フロントエンドからバックエンドまで一通り触り、作ったものが動き出す瞬間が好きです。',
      '最近はAIエンジニアリング（RAG/AIエージェント）にハマっていて、試作と学習を続けています。',
      '将来的には技術でチームを前に進められるテックリードを目指しています。'
    ]

    const strengthItems: StrengthItem[] = [
      {
        title: 'ものづくりの一連が好き',
        text: 'アイデア出しから実装、改善まで自分で回すのが楽しいタイプです。小さく作って試すサイクルを大切にしています。'
      },
      {
        title: '技術の幅と好奇心',
        text: 'Vue/React/TypeScript、Go/Python/C#/Javaなど広く触れています。新しい技術はまず試してみます。'
      },
      {
        title: 'AI/自動化の探究',
        text: 'RAGやAIエージェント、Claude Codeの活用など、日々試行中です。'
      },
      {
        title: 'チームへの目線',
        text: 'レビューやドキュメントを丁寧に。チームが迷わず動ける状態を作るのが好きです。'
      }
    ]

    const careerItems: CareerItem[] = [
      {
        year: '2015',
        text: '専門学校卒業後、技術職としてキャリアをスタート。'
      },
      {
        year: '2019',
        text: 'Webアプリケーション開発へシフト。フロント〜バックエンドまで幅広く担当。'
      },
      {
        year: '2022 - 2025',
        text: '医療/金融/業務系の開発や運用に従事。設計・実装・レビューまで経験。'
      },
      { year: '2023 -', text: '業務外でもプロトタイプやツール制作を継続。' },
      { year: '2024 -', text: 'AIエンジニアリングの学習と試作を継続中。' },
    ]

    const projectItems: ProjectItem[] = [
      {
        name: 'Nudge',
        stack: 'Go / Wails / Notion',
        text: 'Notionと簡易的にデータやり取りをするためのアプリ。タスク管理や習慣をNotionで管理する際に、日常的に素早くアクセスできる管理ツールを目指している。'
      },
      {
        name: 'tech-site',
        stack: 'TypeScript / Nuxt.js',
        text: '技術ブログサイト。学習内容や検証結果を発信する場として運用中。'
      },
      {
        name: 'bandue',
        stack: 'Vue.js',
        text: 'SNS系Webアプリのプロトタイプ。UI/UXと機能設計の検証が目的。'
      }
    ]

    const valueItems: string[] = [
      '小さく作って早く検証する',
      '読みやすく、直しやすいコードを心がける',
      'ユーザー価値に近いところから手を動かす',
      '技術でチームの前進を支える'
    ]

    return {
      skills: SKILLS,
      summaryTexts,
      strengthItems,
      careerItems,
      projectItems,
      valueItems
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
    animation-delay: 0.3s;
  }

  .skills-section {
    animation-delay: 0.4s;
  }

  .summary-section {
    animation-delay: 0.1s;
  }

  .strengths-section {
    animation-delay: 0.2s;
  }

  .projects-section {
    animation-delay: 0.5s;
  }

  .values-section {
    animation-delay: 0.6s;
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
  .timeline-item:nth-child(4) { animation-delay: 0.6s; }
  .timeline-item:nth-child(5) { animation-delay: 0.7s; }

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

  /* Summary */
  .summary-body {
    @apply space-y-4;
  }

  .summary-text {
    @apply text-sm md:text-base tracking-wide;
    color: rgba(51, 51, 51, 0.85);
  }

  .dark .summary-text {
    color: rgba(255, 255, 255, 0.85);
  }

  /* Strengths */
  .strength-grid {
    @apply grid gap-6 md:grid-cols-2;
  }

  .strength-card {
    @apply rounded-lg border p-5;
    border-color: rgba(84, 110, 122, 0.25);
    background-color: rgba(144, 164, 174, 0.08);
  }

  .dark .strength-card {
    border-color: rgba(144, 164, 174, 0.35);
    background-color: rgba(38, 50, 56, 0.4);
  }

  .strength-title {
    @apply text-base md:text-lg font-bold tracking-wide mb-2;
    @apply text-site-black dark:text-white;
  }

  .strength-text {
    @apply text-sm md:text-base tracking-wide;
    color: rgba(51, 51, 51, 0.8);
  }

  .dark .strength-text {
    color: rgba(255, 255, 255, 0.8);
  }

  /* Projects */
  .project-list {
    @apply space-y-6;
  }

  .project-item {
    @apply pb-4 border-b;
    border-color: rgba(84, 110, 122, 0.2);
  }

  .dark .project-item {
    border-color: rgba(144, 164, 174, 0.3);
  }

  .project-header {
    @apply flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2;
  }

  .project-name {
    @apply text-lg font-bold tracking-wide;
    @apply text-site-black dark:text-white;
  }

  .project-stack {
    @apply text-xs font-mono px-2 py-1 rounded;
    @apply text-site-theme dark:text-site-theme-light;
    background-color: rgba(144, 164, 174, 0.2);
  }

  .dark .project-stack {
    background-color: rgba(84, 110, 122, 0.2);
  }

  .project-text {
    @apply text-sm md:text-base tracking-wide;
    color: rgba(51, 51, 51, 0.8);
  }

  .dark .project-text {
    color: rgba(255, 255, 255, 0.8);
  }

  /* Values */
  .value-list {
    @apply grid gap-3 md:grid-cols-2;
  }

  .value-item {
    @apply text-sm md:text-base tracking-wide relative pl-5;
    color: rgba(51, 51, 51, 0.85);
  }

  .value-item::before {
    content: '•';
    @apply absolute left-0 top-0;
    @apply text-site-theme dark:text-site-theme-light;
  }

  .dark .value-item {
    color: rgba(255, 255, 255, 0.85);
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
