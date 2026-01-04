<template>
  <section class="hero-container">
    <!-- Background Effects -->
    <div class="hero-bg">
      <div class="bg-gradient-orb bg-orb-1"></div>
      <div class="bg-gradient-orb bg-orb-2"></div>
      <div class="bg-grid-pattern"></div>
    </div>

    <!-- Main Content -->
    <div class="hero-content">
      <!-- Code-style greeting -->
      <transition name='down_fade' appear @before-appear='beforeAppear' @after-appear='afterAppear'>
        <div class="greeting-code" data-delay='0'>
          <span class="code-comment">// Welcome</span>
        </div>
      </transition>

      <!-- Main headline -->
      <transition name='down_fade' appear @before-appear='beforeAppear' @after-appear='afterAppear'>
        <h1 class="hero-title" data-delay='200'>
          <span class="title-line">Hello,</span>
          <span class="title-line title-accent">I'm <span class="highlight">Yoshihiko</span></span>
        </h1>
      </transition>

      <!-- Subtitle with typing effect style -->
      <transition name='down_fade' appear @before-appear='beforeAppear' @after-appear='afterAppear'>
        <p class='hero-subtitle' data-delay='500'>
          <span class="subtitle-bracket">&lt;</span>
          <span class="subtitle-text">Full Stack Engineer</span>
          <span class="subtitle-bracket">/&gt;</span>
        </p>
      </transition>

      <!-- Description -->
      <transition name='down_fade' appear @before-appear='beforeAppear' @after-appear='afterAppear'>
        <p class='hero-description' data-delay='700'>
          Sending useful information centered on programming
        </p>
      </transition>

      <!-- CTA Buttons -->
      <transition name='down_fade' appear @before-appear='beforeAppear' @after-appear='afterAppear'>
        <div class="hero-actions" data-delay='1000'>
          <nuxt-link to="/about" class='btn-primary'>
            <span class="btn-text">About me</span>
            <span class="btn-arrow">→</span>
          </nuxt-link>
          <nuxt-link to="/blog" class='btn-secondary'>
            <span class="btn-text">Read Blog</span>
          </nuxt-link>
        </div>
      </transition>

      <!-- Decorative terminal prompt -->
      <transition name='down_fade' appear @before-appear='beforeAppear' @after-appear='afterAppear'>
        <div class="terminal-prompt" data-delay='1200'>
          <span class="prompt-symbol">$</span>
          <span class="prompt-text">explore --portfolio</span>
          <span class="cursor-blink">_</span>
        </div>
      </transition>
    </div>

    <!-- Scroll indicator -->
    <div class="scroll-indicator">
      <div class="scroll-mouse">
        <div class="scroll-wheel"></div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
export default defineComponent({
  layout: 'home',
  head: {
    title: 'Home',
    meta: [
      { hid: 'description', name: 'description', content: 'yoshihiko home page' },
      { hid: 'og:title', property: 'og:title', content: 'Home | Yoshihiko' },
      { hid: 'og:description', property: 'og:description', content: 'yoshihiko home page' },
      { hid: 'og:url', property: 'og:url', content: `${process.env.ORIGIN}/` || 'http://localhost:3000' },
      { hid: 'twitter:title', property: 'twitter:title', content: 'Home | Yoshihiko' },
      { hid: 'twitter:description', property: 'twitter:description', content: 'yoshihiko home page' },
    ]
  },
  setup() {
    const beforeAppear = (el: HTMLElement) => {
      const msec = el.dataset.delay
      el.style.transitionDelay = `${msec}ms`
    }
    const afterAppear = (el: HTMLElement) => {
      el.style.transitionDelay = ''
    }
    return {
      beforeAppear,
      afterAppear,
    }
  },
})
</script>

<style lang="scss" scoped>
/* ========================================
   Hero Section - Tech-inspired Design
   ======================================== */

.hero-container {
  @apply relative flex items-center justify-center;
  min-height: calc(100vh - 64px);
  overflow: hidden;
}

/* Background Effects */
.hero-bg {
  @apply absolute inset-0 pointer-events-none;
  z-index: 0;
}

.bg-gradient-orb {
  @apply absolute rounded-full;
  filter: blur(80px);
  opacity: 0.15;
}

.bg-orb-1 {
  @apply w-96 h-96;
  background: linear-gradient(135deg, #90A4AE 0%, #546E7A 100%);
  top: -10%;
  right: -5%;
  animation: float-slow 20s ease-in-out infinite;
}

.bg-orb-2 {
  @apply w-64 h-64;
  background: linear-gradient(135deg, #546E7A 0%, #263238 100%);
  bottom: 10%;
  left: -5%;
  animation: float-slow 15s ease-in-out infinite reverse;
}

.bg-grid-pattern {
  @apply absolute inset-0;
  opacity: 0.03;
  background-image:
    linear-gradient(rgba(84, 110, 122, 0.5) 1px, transparent 1px),
    linear-gradient(90deg, rgba(84, 110, 122, 0.5) 1px, transparent 1px);
  background-size: 60px 60px;
}

.dark .bg-grid-pattern {
  opacity: 0.08;
}

/* Main Content */
.hero-content {
  @apply relative z-10 text-center px-4;
  max-width: 800px;
}

/* Code-style greeting */
.greeting-code {
  @apply mb-6;
}

.code-comment {
  @apply inline-block text-sm font-mono px-3 py-1 rounded;
  @apply text-site-theme dark:text-site-theme-light;
  background-color: rgba(84, 110, 122, 0.1);
}

.dark .code-comment {
  background-color: rgba(144, 164, 174, 0.1);
}

/* Hero Title */
.hero-title {
  @apply mb-6;
}

.title-line {
  @apply block text-4xl sm:text-5xl md:text-6xl font-bold tracking-wide;
  @apply text-site-black dark:text-white;
  line-height: 1.2;
}

.title-accent {
  @apply mt-2;
}

.highlight {
  @apply relative inline-block;
  background: linear-gradient(135deg, #546E7A 0%, #90A4AE 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Subtitle */
.hero-subtitle {
  @apply text-lg sm:text-xl mb-4 flex items-center justify-center gap-2;
  font-family: 'Inconsolata', monospace;
}

.subtitle-bracket {
  @apply text-site-theme-light dark:text-site-theme;
  animation: pulse-opacity 2s ease-in-out infinite;
}

.subtitle-text {
  @apply text-site-theme dark:text-site-theme-light tracking-widest;
}

/* Description */
.hero-description {
  @apply text-base sm:text-lg mb-8 tracking-wide;
  color: rgba(51, 51, 51, 0.7);
}

.dark .hero-description {
  color: rgba(255, 255, 255, 0.7);
}

/* CTA Buttons */
.hero-actions {
  @apply flex flex-wrap items-center justify-center gap-4 mb-10;
}

.btn-arrow {
  @apply transition-transform duration-300;
}

.btn-primary {
  @apply relative inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium tracking-wide;
  @apply text-white transition-all duration-300;
  background: linear-gradient(135deg, #546E7A 0%, #263238 100%);
  box-shadow: 0 4px 20px -4px rgba(84, 110, 122, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px -4px rgba(84, 110, 122, 0.5);
  }

  &:hover .btn-arrow {
    transform: translateX(4px);
  }
}

.btn-secondary {
  @apply inline-flex items-center px-6 py-3 rounded-lg font-medium tracking-wide;
  @apply border-2 transition-all duration-300;
  @apply border-site-theme text-site-theme;
  @apply dark:border-site-theme-light dark:text-site-theme-light;

  &:hover {
    @apply bg-site-theme text-white;
    @apply dark:bg-site-theme-light dark:text-site-black-back;
    transform: translateY(-2px);
  }
}

/* Terminal Prompt */
.terminal-prompt {
  @apply inline-flex items-center gap-2 text-sm font-mono px-4 py-2 rounded-lg;
  @apply border border-gray-200 dark:border-gray-700;
  background-color: rgba(249, 250, 251, 0.8);
}

.dark .terminal-prompt {
  background-color: rgba(30, 32, 35, 0.8);
}

.prompt-symbol {
  @apply text-site-theme dark:text-site-theme-light font-bold;
}

.prompt-text {
  color: rgba(51, 51, 51, 0.8);
}

.dark .prompt-text {
  color: rgba(255, 255, 255, 0.8);
}

.cursor-blink {
  @apply text-site-theme dark:text-site-theme-light;
  animation: blink 1s step-end infinite;
}

/* Scroll Indicator */
.scroll-indicator {
  @apply absolute bottom-8 left-1/2 transform -translate-x-1/2;
  animation: bounce-gentle 2s ease-in-out infinite;
}

.scroll-mouse {
  @apply w-6 h-10 rounded-full border-2;
  @apply border-site-theme-light dark:border-site-theme;
}

.scroll-wheel {
  @apply w-1 h-2 rounded-full mx-auto mt-2;
  @apply bg-site-theme dark:bg-site-theme-light;
  animation: scroll-wheel 1.5s ease-in-out infinite;
}

/* Transitions */
.down_fade-enter-active {
  transition: opacity 0.6s ease-out, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}

.down_fade-enter {
  opacity: 0;
  transform: translateY(-24px);
}

.down_fade-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.97);
}

/* Keyframes */
@keyframes float-slow {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(30px, -30px) rotate(5deg);
  }
  66% {
    transform: translate(-20px, 20px) rotate(-5deg);
  }
}

@keyframes pulse-opacity {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes bounce-gentle {
  0%, 100% {
    transform: translateX(-50%) translateY(0);
  }

  50% {
    transform: translateX(-50%) translateY(8px);
  }
}

@keyframes scroll-wheel {
  0% {
    opacity: 1;
    transform: translateY(0);
  }

  100% {
    opacity: 0;
    transform: translateY(8px);
  }
}
</style>
