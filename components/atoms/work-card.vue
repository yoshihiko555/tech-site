<template>
  <article class="work-card">
    <!-- Card Image -->
    <div class="card-image-container">
      <slot name="image" />
      <div class="image-overlay"></div>
    </div>

    <!-- Card Content -->
    <div class="card-content">
      <div class="card-header">
        <h3 class="card-title"><slot name="title" /></h3>
        <vs-button
          v-if="sourceUrl"
          :href="sourceUrl"
          blank
          icon
          class="source-btn"
        >
          <slot name="icon" />
        </vs-button>
      </div>
      <p class="card-description"><slot name="description" /></p>
      <div v-if="siteUrl && siteUrl !== '/'" class="card-footer">
        <a :href="siteUrl" target="_blank" rel="noopener" class="view-link">
          <span>View Project</span>
          <i class="bx bx-right-arrow-alt"></i>
        </a>
      </div>
    </div>

    <!-- Hover Border Effect -->
    <div class="card-border"></div>
  </article>
</template>

<script lang='ts'>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  props: {
    siteUrl: {
      type: String,
      required: true,
    },
    sourceUrl: {
      type: String,
      default: null,
    }
  },
})
</script>

<style lang="scss" scoped>
.card-image-container {
  @apply relative w-full overflow-hidden;
  height: 200px;

  ::v-deep img {
    @apply w-full h-full object-cover;
    transition: transform 0.5s ease;
  }
}

.image-overlay {
  @apply absolute inset-0;
  background: linear-gradient(135deg, #546E7A 0%, #263238 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card-border {
  @apply absolute inset-0 rounded-xl pointer-events-none;
  border: 2px solid transparent;
  background: linear-gradient(135deg, #90A4AE, #546E7A) border-box;
  -webkit-mask:
    linear-gradient(#fff 0 0) padding-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.view-link {
  @apply inline-flex items-center gap-2 text-sm font-medium tracking-wide;
  @apply text-site-theme dark:text-site-theme-light;
  @apply transition-colors duration-300;

  i {
    @apply transition-transform duration-300;
  }

  &:hover {
    @apply text-site-theme-dark dark:text-white;
  }
}

.work-card {
  @apply relative flex flex-col overflow-hidden rounded-xl;
  @apply bg-white dark:bg-site-black-theme;
  @apply border border-gray-100 dark:border-gray-800;
  @apply transition-all duration-300;
  box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px -8px rgba(84, 110, 122, 0.2);

    .card-border {
      opacity: 1;
    }

    .image-overlay {
      opacity: 0.15;
    }

    .card-image-container ::v-deep img {
      transform: scale(1.05);
    }

    .view-link i {
      transform: translateX(4px);
    }
  }
}

.card-content {
  @apply flex flex-col flex-grow p-5;
}

.card-header {
  @apply flex items-start justify-between gap-3 mb-3;
}

.card-title {
  @apply text-lg font-bold tracking-wide;
  @apply text-site-black dark:text-white;
}

.source-btn {
  @apply flex-shrink-0;
  @apply text-site-theme dark:text-site-theme-light;

  &:hover {
    @apply bg-site-theme text-white;
  }
}

.card-description {
  @apply text-sm tracking-wide mb-4 flex-grow;
  color: rgba(51, 51, 51, 0.7);
}

.dark .card-description {
  color: rgba(255, 255, 255, 0.7);
}

.card-footer {
  @apply pt-3 border-t border-gray-100 dark:border-gray-700;
}
</style>
