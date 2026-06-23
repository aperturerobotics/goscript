import { describe, expect, it } from 'vitest'

import {
  LeadingZeros16,
  LeadingZeros8,
  Len16,
  Len8,
  Mul64,
  Rem,
  Rem32,
  Rem64,
  RotateLeft16,
  RotateLeft32,
  RotateLeft64,
  RotateLeft8,
} from './index.js'

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

  it('counts leading zeros over the 8/16-bit width, not 32', () => {
    // Zero must yield the full width, and Len of zero is 0 (Go len8tab[0]).
    expect(LeadingZeros8(0)).toBe(8)
    expect(LeadingZeros16(0)).toBe(16)
    expect(Len8(0)).toBe(0)
    expect(Len16(0)).toBe(0)
    // Non-zero values keep their width-relative counts.
    expect(LeadingZeros8(1)).toBe(7)
    expect(LeadingZeros8(0xff)).toBe(0)
    expect(Len8(0xff)).toBe(8)
    expect(LeadingZeros16(1)).toBe(15)
    expect(Len16(0x8000)).toBe(16)
  })

  it('returns remainders from double-word division helpers', () => {
    expect(Rem32(1, 0, 3)).toBe(1)
    expect(Rem(1n, 0n, 3n)).toBe(1n)
    expect(Rem64(1n, 0n, 3n)).toBe(1n)
  })

  it('rotates right for negative counts', () => {
    expect(RotateLeft8(1, -1)).toBe(0x80)
    expect(RotateLeft16(1, -1)).toBe(0x8000)
    expect(RotateLeft32(1, -1)).toBe(0x80000000)
    expect(RotateLeft64(1n, -1)).toBe(0x8000000000000000n)
  })
})
