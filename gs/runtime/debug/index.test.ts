import { describe, expect, it, vi } from 'vitest'

import { PrintStack, Stack } from './index.js'

describe('runtime/debug override', () => {
  it('returns a stack trace as bytes', () => {
    const stack = Stack()

    expect(stack).toBeInstanceOf(Uint8Array)
    expect(new TextDecoder().decode(stack)).toContain('Error')
  })

  it('prints the current stack trace', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    try {
      PrintStack()
      expect(consoleError).toHaveBeenCalledTimes(1)
      expect(consoleError.mock.calls[0][0]).toContain('Error')
    } finally {
      consoleError.mockRestore()
    }
  })
})
