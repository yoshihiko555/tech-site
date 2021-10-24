<template>
  <div>
    <h1 class="page-title">Event</h1>
    <div class="mb-4">
      <p class="text-xl">.self</p>
      <div @click.self="handler" class="p-2 cursor-pointer text-white bg-site-theme-dark">
        親要素のボタン
        <div class="p-2 cursor-pointer text-white bg-site-theme-light">
          子要素のボタン
        </div>
      </div>
    </div>
    <div class="mb-4">
      <p class="text-xl">.native</p>
      <child-btn @click="handler">通常のボタン</child-btn>
      <child-btn @click.native="handler">native修飾子付きボタン</child-btn>
    </div>
    <div class="mb-4">
      <p class="text-xl">vue-shortkey</p>
      <div v-shortkey="['ctrl', 'k']" @shortkey="handler" />
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from '@nuxtjs/composition-api'
import ChildBtn from '~/components/varification/event-child.vue'
export default defineComponent({
  components: {
    ChildBtn
  },
  setup () {
    const handler = () =>{
      console.log('発火')
    }
    return {
      handler
    }
  }
})
</script>

<style lang='scss' scoped>

</style>
