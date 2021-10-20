<template>
  <div class="grid sm:grid-cols-2">
    <div
      v-for="skill in skills"
      :key="skill.name"
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
