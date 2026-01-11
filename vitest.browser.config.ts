import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { playwright } from '@vitest/browser-playwright'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  test: {
    name: 'browser',
    include: ['tests/tests/**/*.browser.test.ts'],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
    testTimeout: 60000,
    hookTimeout: 60000,
  },
  resolve: {
    alias: [
      // Map @goscript/*.js to gs/*.ts
      {
        find: /^@goscript\/(.*)\.js$/,
        replacement: resolve(rootDir, 'gs/$1.ts'),
      },
      // Map @goscript/* to gs/*
      {
        find: /^@goscript\/(.*)$/,
        replacement: resolve(rootDir, 'gs/$1'),
      },
    ],
  },
})
