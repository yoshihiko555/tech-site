import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const root = fileURLToPath(new URL('./', import.meta.url))

/** Unit tests for plain functions; Nuxt runtime helpers are not loaded. */
export default defineConfig({
  resolve: {
    alias: {
      '~~': root,
      '#shared': `${root}shared`,
    },
  },
  test: {
    include: ['test/unit/**/*.test.ts'],
    environment: 'node',
  },
})
