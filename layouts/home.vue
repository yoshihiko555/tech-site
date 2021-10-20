<template>
  <div>
    <Header />
    <transition name="fade">
      <Nuxt class="root-wrapper container" />
    </transition>
  </div>
</template>

<script lang='ts'>
/**
 * TODO : Layout間のtransitionが効かない問題
 */
import { defineComponent } from '@nuxtjs/composition-api'
import Header from '~/components/organisms/header.vue'
export default defineComponent({
  components: { Header },
})
</script>

<style lang='scss' scoped>
@include animation($tran-name: 'fade', $anime-name: ('fade'));

.root-wrapper {
  padding-top: $header-h;
  min-height: calc(100vh - #{$header-h});
}
</style>
