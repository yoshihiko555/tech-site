<template>
  <span
    class="tag"
    :class="{small:small}"
    @click="$router.push(`/tags/${tag.slug}`)"
  >
    #{{ tag.name }}
  </span>
</template>

<script lang='ts'>
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { Tags } from '~/generated/graphql'
export default defineComponent({
  props: {
    tag: {
      type: Object as PropType<Tags>,
      required: true,
    },
    small: {
      type: Boolean,
      default: false,
    }
  },
  setup () {

    return {

    }
  }
})
</script>

<style lang="scss" scoped>
  .tag {
    @apply
      inline-block
      px-3 py-2 mr-2
      cursor-pointer
      text-sm text-gray-500 dark:text-gray-100 dark:hover:text-site-black-back
      bg-white dark:bg-site-black-theme hover:bg-gray-100 dark:hover:bg-gray-50
      border border-gray-300
      rounded-2xl
      transition-colors ease-in-out;

    &.small {
      @apply px-2 py-1 text-xs;
    }
  }
</style>
