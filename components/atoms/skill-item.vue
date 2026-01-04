<template>
  <div class="skill-card">
    <div class="skill-icon-wrapper">
      <div class="skill-icon">
        <img v-if="$colorMode.value === 'light'" :src='skill.light' :alt='skill.name' class="icon-img" />
        <img v-else :src='skill.dark' :alt='skill.name' class="icon-img" />
      </div>
    </div>
    <div class='skill-content'>
      <div class="skill-header">
        <h6 class='skill-name'>{{ skill.name }}</h6>
        <span class='skill-period'>
          <span class="period-value">{{ skill.period }}</span>
          <span class="period-unit">{{ skill.period === 1 ? 'year' : 'years' }}</span>
        </span>
      </div>
      <div class='progress-container'>
        <div class="progress-track">
          <div
            class="progress-bar"
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax="100"
            :aria-valuenow="skill.percent"
            :style='{ "--progress-width": skill.percent + "%" }'
          ></div>
        </div>
        <span class="progress-value">{{ skill.percent }}%</span>
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
  .skill-card {
    @apply flex items-center gap-4 p-4 rounded-xl;
    @apply border border-gray-100 dark:border-gray-800;
    @apply transition-all duration-300 ease-out;
    background-color: rgba(249, 250, 251, 0.5);
    backdrop-filter: blur(8px);

    .dark & {
      background-color: rgba(24, 25, 28, 0.5);
    }

    &:hover {
      @apply border-site-theme-light dark:border-site-theme;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px -8px rgba(84, 110, 122, 0.15);
    }
  }

  .skill-icon-wrapper {
    @apply flex-shrink-0;
  }

  .skill-icon {
    @apply w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center;
    @apply bg-white dark:bg-site-black-back;
    @apply border border-gray-100 dark:border-gray-700;
  }

  .icon-img {
    @apply w-8 h-8 sm:w-9 sm:h-9 object-contain;
  }

  .skill-content {
    @apply flex-grow min-w-0;
  }

  .skill-header {
    @apply flex items-baseline justify-between mb-2;
  }

  .skill-name {
    @apply text-base sm:text-lg font-semibold tracking-wide;
    @apply text-site-black dark:text-white;
  }

  .skill-period {
    @apply text-xs font-mono;
    @apply text-site-theme dark:text-site-theme-light;
  }

  .period-value {
    @apply font-bold;
  }

  .period-unit {
    @apply ml-0.5;
    opacity: 0.7;
  }

  .progress-container {
    @apply flex items-center gap-3;
  }

  .progress-track {
    @apply flex-grow h-2 rounded-full overflow-hidden;
    @apply bg-gray-200 dark:bg-gray-700;
  }

  .progress-bar {
    @apply h-full rounded-full;
    width: var(--progress-width, 0%);
    background: linear-gradient(90deg, #90A4AE 0%, #546E7A 100%);
    animation: progressFill 1s ease-out forwards;
    transform-origin: left;
  }

  .progress-value {
    @apply text-xs font-mono font-bold flex-shrink-0;
    @apply text-site-theme dark:text-site-theme-light;
    min-width: 36px;
    text-align: right;
  }

  @keyframes progressFill {
    from {
      transform: scaleX(0);
    }
    to {
      transform: scaleX(1);
    }
  }
</style>
