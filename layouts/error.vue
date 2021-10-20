<template>
  <div class="main flex justify-center items-center text-2xl">
    <h1>{{ dispTitle }}</h1>
  </div>
</template>

<script lang='ts'>
import { defineComponent, toRefs, useMeta, PropType } from '@nuxtjs/composition-api'
import { NuxtError } from '~/types'
export default defineComponent({
  props: {
    error: {
      type: Object as PropType<NuxtError>, //-> Errorになる
      default: null
    }
  },
  head: {},
  setup (props) {
    const { title, meta } = useMeta()

    const getTitle = () => {
      switch (props.error.statusCode) {
        case 404: return '404 Page Notfound'
        case 500: return '500 Internal Server Error'
        default: return 'An error occurred'
      }
    }

    title.value = getTitle()

    return {
      dispTitle: getTitle()
    }
  }
})
</script>

<style lang="scss" scoped>
h1 {
  @include r-line-blink;
}
</style>
