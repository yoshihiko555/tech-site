<template>
  <section class="flex">
    <div class="self-center">
      <transition name='down_fade' appear @before-appear='beforeAppear' @after-appear='afterAppear'>
        <h2 class="text-2xl font-normal mb-4" data-delay='0'>Hello<br />Welcome to my site</h2>
      </transition>
      <transition name='down_fade' appear @before-appear='beforeAppear' @after-appear='afterAppear'>
        <p class='mb-4' data-delay='500'>Sending useful information centered on programming</p>
      </transition>
      <transition name='down_fade' appear @before-appear='beforeAppear' @after-appear='afterAppear'>
        <nuxt-link
          to="/about"
          class='btn'
          data-delay='1000'
        >
          About me!
        </nuxt-link>
      </transition>
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
      { hid: 'og:url', property: 'og:url', content: `${process.env.ORIGIN}` || 'http://localhost:3000' },
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
.btn {
  // border-site-theme 後で追加
  @apply relative inline-block px-4 py-2 text-lg tracking-widest border bg-transparent transition-all duration-500 ease-in-out z-0 hover:text-white;

  &::after {
    @apply absolute top-0 right-0 w-0 h-full bg-site-theme transition-all duration-500 ease-in-out;
    content: '';
    z-index: -1;
  }

  &:hover {
    @apply px-6;
  }

  &:hover::after {
    left: 0;
    width: 100%;
  }
}

.down_fade-enter-active {
  transition: opacity .5s ease-in-out, transform .6s ease-in;
}

.down_fade-enter {
  opacity: 0;
  transform: translateY(-20px);
}

.down_fade-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.97);
}
</style>
