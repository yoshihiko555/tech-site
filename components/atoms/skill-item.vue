<template>
  <div class="mb-4 flex align-center h-20">
    <div class='icon text-center h-full'>
      <img :src='skill.icon' :alt='skill.name' class="p-2 inline-block max-h-full" />
    </div>
    <div class='root self-center'>
      <h6 class='inline-block text-xl mr-2'>{{ skill.name }}</h6>
      <span class='inline-block text-sm text-gray-300'>{{ skill.period }}year</span>
      <div class='progress-root'>
        <div
          class="bar"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuenow="skill.percent"
          :style='{ width: skill.percent + "%" }'
        >
          {{ skill.percent }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType } from '@nuxtjs/composition-api'
import { SkillType } from '~/utils/const'
export default defineComponent({
  props: {
    skill: {
      type: Object as PropType<SkillType>,
      required: true,
    }
  },
})
</script>

<style lang="scss" scoped>
  .icon {
    flex-basis: 20%;
  }

  .root {
    flex-basis: 80%;
  }

  .progress-root {
    height: 1.5rem;
		overflow: hidden;
		font-size: 1rem;
		font-weight: 500;
		background-color: #f5f5f5;
		border-radius: .25rem;

    .bar {
			display: flex;
			flex-direction: column;
			justify-content: center;
			color: #fff;
			text-align: center;
			white-space: nowrap;
			background-image: linear-gradient(to right, #e2ebf0 0%, #cfd9df 100%);
		}
  }
</style>
