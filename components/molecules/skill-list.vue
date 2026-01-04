<template>
  <div class="skills-grid">
    <div
      v-for="(skill, index) in skills"
      :key="skill.name"
      class="skill-grid-item"
      :style="{ '--delay': index * 0.1 + 's' }"
    >
      <skill-item :skill="skill" />
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { SkillType } from '~/utils/const'
import SkillItem from '~/components/atoms/skill-item.vue'

export default defineComponent({
  components: {
    SkillItem,
  },
  props: {
    skills: {
      type: Array as PropType<SkillType[]>,
      required: true,
    }
  },
  setup () {

    return {

    }
  }
})
</script>

<style lang="scss" scoped>
  .skills-grid {
    @apply grid sm:grid-cols-2 gap-4 md:gap-6;
  }

  .skill-grid-item {
    animation: fadeInUp 0.6s ease-out forwards;
    animation-delay: var(--delay, 0s);
    opacity: 0;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
