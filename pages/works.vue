<template>
  <div>
    <h1 class='page-title'>Works</h1>
    <div class="m-0 w-screen relative left-1/2 transform -translate-x-1/2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <work-card v-for="work in works" :key="work.name" :siteUrl="work.siteUrl" :sourceUrl="work.sourceUrl">
        <template #image>
          <img :src="work.img" :alt='work.name' />
        </template>
        <template #icon>
          <i class='bx' :class='work.sourceIcon' />
        </template>
        <template #title>
          {{ work.name }}
        </template>
        <template #description>
          {{ work.description }}
        </template>
      </work-card>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from '@nuxtjs/composition-api'
import WorkCard from '~/components/atoms/work-card.vue'
import { WORKS, WorkType } from '~/utils/const'
type Data = {
  works: WorkType[]
}
export default defineComponent({
  components: {
    WorkCard,
  },
  head: {
    title: 'Works',
    meta: [
      { hid: 'description', name: 'description', content: 'yoshihiko works page' },
      { hid: 'og:title', property: 'og:title', content: 'Works | Yoshihiko' },
      { hid: 'og:description', property: 'og:description', content: 'yoshihiko works page' },
      { hid: 'og:url', property: 'og:url', content: `${process.env.ORIGIN}/works` || 'http://localhost:3000/works' },
      { hid: 'twitter:title', property: 'twitter:title', content: 'Works | Yoshihiko' },
      { hid: 'twitter:description', property: 'twitter:description', content: 'yoshihiko works page' },
    ]
  },
  setup (): Data {
    return {
      works: WORKS,
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
