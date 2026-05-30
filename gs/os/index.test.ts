import { describe, expect, it } from 'vitest'

import { ErrNoHandle } from './index.js'

describe('os override', () => {
  it('exports ErrNoHandle', () => {
    expect(ErrNoHandle?.Error()).toBe('os: process handle unavailable')
  })
})
