<template>
  <figure class="root">
    <slot name='image' />
    <vs-button
      v-show="sourceUrl"
      :href='sourceUrl'
      blank
      icon
      class="icon"
    >
      <slot name='icon' />
    </vs-button>
    <figcaption class="caption">
      <h3 class="title"><slot name='title' /></h3>
      <p class="description"><slot name='description' /></p>
    </figcaption>
    <a class="absolute top-0 left-0 w-full h-full z-10 opacity-0" :href="siteUrl" target='blank' />
  </figure>
</template>

<script lang='ts'>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    siteUrl: {
      type: String,
      required: true,
    },
    sourceUrl: {
      type: String,
      default: null,
    }
  },
})
</script>

<style lang="scss" scoped>
  .root {
    @apply relative w-full text-center bg-site-theme cursor-pointer overflow-hidden;
    aspect-ratio: 16/10;

    img {
      @apply relative block opacity-70 object-cover transition-opacity ease-in-out duration-300;
    }

    .icon {
      @apply absolute top-2 right-2 z-20 text-site-theme bg-transparent ease-in-out hover:text-white hover:bg-site-theme-dark hover:bg-opacity-70;
    }

    .caption {
      @apply absolute top-0 left-0 w-full h-full p-8;
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;

      .title {
        @apply absolute top-1/2 left-1/2 text-white text-2xl transition-all duration-300 ease-in-out transform -translate-x-1/2 -translate-y-1/2;
      }

      .description {
        @apply absolute top-1/2 left-1/2 text-white text-xs tracking-wide transition-all duration-300 ease-in-out opacity-0 transform -translate-x-1/2 -translate-y-1/2;
        padding-top: 10em;
      }

      &::before, &::after {
        @apply absolute top-8 right-8 bottom-8 left-8 pointer-events-none opacity-0 box-border;
        content: '';
        -webkit-transition: opacity 0.35s, -webkit-transform 0.35s;
        transition: opacity 0.45s, transform 0.35s;
      }

      &::before {
        @apply border-white border-t border-b;
        -webkit-transform: scale(0, 1);
        transform: scale(0, 1);
      }

      &::after {
        @apply border-white border-r border-l;
        -webkit-transform: scale(1, 0);
        transform: scale(1, 0);
      }
    }

    &:hover {
      img {
        @apply opacity-40;
      }

      .caption {
        .title, .description {
          @apply opacity-100 transform -translate-x-1/2 translate-y-0;
        }
        .description { padding-top: 5em; }

        &::before, &::after {
          @apply opacity-100;
          -webkit-transform: scale(1);
          transform: scale(1);
        }
      }
    }
  }
</style>
