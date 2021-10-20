<template>
  <div>
    <div class='py-5 text-center'>
      <h3 class='mb-1 text-2xl tracking-wider'>Yoshihiko</h3>
      <p class='text-lg'>Engineer</p>
    </div>
    <div class='mb-10'>
      <h4 class='mb-2 text-xl'>Career</h4>
      <div class="pl-4">
        <p class='text'>1994年生まれ。栃木県出身。</p>
        <p class='text'>専門学校を卒業後、業界の技術職として4年間従事。</p>
        <p class='text'>2019年に某IT会社に転職。</p>
      </div>
    </div>
    <div>
      <h4 class='mb-2 text-xl'>Skill</h4>
      <skill-list :skills="skills" />
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from '@nuxtjs/composition-api'
import SkillList from '~/components/molecules/skill-list.vue'
import { SKILLS, SkillType } from '~/utils/const'

type Data = {
  skills: SkillType[]
}

export default defineComponent({
  components: {
    SkillList
  },
  head: {
    title: 'About',
    meta: [
      { hid: 'description', name: 'description', content: 'yoshihiko about page' },
      { hid: 'og:title', property: 'og:title', content: 'About | Yoshihiko' },
      { hid: 'og:description', property: 'og:description', content: 'yoshihiko about page' },
      { hid: 'og:url', property: 'og:url', content: `${process.env.ORIGIN}/about` || 'http://localhost:3000/about' },
      { hid: 'twitter:title', property: 'twitter:title', content: 'About | Yoshihiko' },
      { hid: 'twitter:description', property: 'twitter:description', content: 'yoshihiko about page' },
    ]
  },
  setup (): Data {
    return {
      skills: SKILLS,
    }
  }
})
</script>

<style lang="postcss" scoped>
  .text {
    @apply mb-1 text-sm tracking-widest;
  }
</style>
