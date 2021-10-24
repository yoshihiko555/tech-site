<template>
  <div @click="childHandler" class="my-1 p-2 cursor-pointer text-white bg-site-theme-dark">
    <slot />
  </div>
</template>

<script lang='ts'>
import { defineComponent } from '@nuxtjs/composition-api'
export default defineComponent({
  setup () {
    const childHandler = () => {
      console.log('child handler')
    }
    return {
      childHandler
    }
  }
})
</script>
