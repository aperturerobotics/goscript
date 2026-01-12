import { configDefaults, defineConfig } from 'vitest/config'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

export default defineConfig({
  test: {
    exclude: [
      ...configDefaults.exclude,
      'dist',
      'vendor',
      '**/vendor',
      '**/tests.browser.test.ts',
      'website/tests/**', // Browser-only tests, run separately with website/vitest.config.ts
    ],
  },
  resolve: {
    alias: [
      // Map @goscript/*.js to gs/*.ts
      {
        find: /^@goscript\/(.*)\.js$/,
        replacement: resolve(
          fileURLToPath(new URL('.', import.meta.url)),
          'gs/$1.ts',
        ),
      },
      // Map @goscript/* to gs/*
      {
        find: /^@goscript\/(.*)$/,
        replacement: resolve(
          fileURLToPath(new URL('.', import.meta.url)),
          'gs/$1',
        ),
      },
    ],
  },
})
