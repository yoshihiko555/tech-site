<template>
  <div>
    <Header />
    <transition name='fade'>
      <Nuxt class="root-wrapper" />
    </transition>
    <Footer />
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import Header from '~/components/organisms/header.vue'
import Footer from '~/components/organisms/footer.vue'

export default Vue.extend({
  components: {
    Header,
    Footer,
  }
})
</script>

<style lang="scss" scoped>
@include animation($tran-name: 'fade', $anime-name: ('fade'));

.root-wrapper {
  @apply container px-8 max-w-screen-xl;
  padding-top: $header-h;
  min-height: calc(100vh - #{($header-h + $footer-h)}) !important;
}
</style>
