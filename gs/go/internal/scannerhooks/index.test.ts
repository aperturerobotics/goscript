import { describe, expect, it } from 'vitest'

import { StringEnd, __goscript_set_StringEnd } from './index.js'

describe('go/internal/scannerhooks override', () => {
  it('stores a synchronous StringEnd hook', () => {
    __goscript_set_StringEnd(() => 12)

    expect(StringEnd?.({})).toBe(12)

    __goscript_set_StringEnd(null)
    expect(StringEnd).toBeNull()
  })
})
