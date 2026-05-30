import { describe, expect, it } from 'vitest'

import { Exit, ProcessExitError } from './proc.gs.js'

describe('os process control', () => {
  it('throws a structured browser exit error when process.exit is unavailable', () => {
    const originalProcess = (globalThis as { process?: unknown }).process
    try {
      ;(globalThis as { process?: unknown }).process = {}

      let err: unknown
      try {
        Exit(7)
      } catch (caught) {
        err = caught
      }

      expect(err).toBeInstanceOf(ProcessExitError)
      expect((err as { __goscriptExitCode?: number }).__goscriptExitCode).toBe(
        7,
      )
    } finally {
      ;(globalThis as { process?: unknown }).process = originalProcess
    }
  })
})
