<template>
  <div>
    <h1>Store</h1>
    <!-- <button @click.prevent='click'>click</button>
    <div class="mb-5" v-for="sample in samples" :key="sample.id">
      <p>{{ sample.id }}</p>
      <p>{{ sample.name }}</p>
    </div> -->
    <div v-if="articles && articles.length">
      <div class="mb-5" v-for="(article, i) in articles" :key="i">
        <div v-if="article !== null">
          <small>{{ article.sys.id }}</small>
          <p>{{ article.title }}</p>
          <div v-html="$md.render(article.content)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent } from '@nuxtjs/composition-api'
import { sampleModule, articlesModule } from '~/utils/store-accessor'
export default defineComponent({
  setup () {
    const articles = computed(() => articlesModule.recentArticles)
    // console.log('vue sampleStore:', sampleModule)
    // const samples = computed(() => sampleModule.samples)
    // console.log('samples:', samples)
    // const click = () => {
    //   console.log('click')
    //   const newSample = { id: 1, name: 'hoge' }
    //   sampleModule.add(newSample)
    // }
    return {
      articles
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
