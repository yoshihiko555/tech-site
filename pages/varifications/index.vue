<template>
  <div>
    <h1 class="mb-5">Varification</h1>
    <div class="grid grid-cols-6">
      <nuxt-link v-for="(varification, i) in varifications" :key="i" :to="`/varifications/${varification}`">
        {{ i }}. {{ varification }}
      </nuxt-link>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from '@nuxtjs/composition-api'
export default defineComponent({
  setup () {
    // 検証先ページ集
    const varifications = [
      'optional-graphql',
      'composition-graphql',
      'store',
      'composition-async',
    ]
    return {
      varifications
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
