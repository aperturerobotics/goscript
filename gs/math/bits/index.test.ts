import { describe, expect, it } from 'vitest'

import { Mul64 } from './index.js'

describe('math/bits override', () => {
  it('returns the full 128-bit product from Mul64', () => {
    expect(Mul64(0xffffffffffffffffn, 0xffffffffffffffffn)).toEqual([
      0xfffffffffffffffen,
      1n,
    ])
    expect(Mul64(0x1fffffffffffffn, 0x1fffffffffffffn)).toEqual([
      0x3ffffffffffn,
      0xffc0000000000001n,
    ])
    expect(Mul64(0x1fffffffffffff, 0x1fffffffffffff)).toEqual([
      0x3ffffffffff,
      0xffc0000000000001n,
    ])
  })
})
